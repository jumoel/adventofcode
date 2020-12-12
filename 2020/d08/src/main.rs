use std::collections::HashSet;
use std::convert::TryFrom;
use std::fs;
use std::str::FromStr;
use std::vec::Vec;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

#[derive(Debug)]
enum Op {
	ACC(i32),
	JMP(i32),
	NOP(i32),
}

type Ops = Vec<Op>;

#[derive(Debug)]
struct VM {
	acc: i32,
	pc: i32,
	ops: Ops,
}

impl VM {
	fn new(code: &str) -> VM {
		let ops = code
			.lines()
			.filter_map(|line| {
				let mut parts = line.split(' ').fuse();

				let op = parts.next()?.trim();
				let arg: i32 = parts.next()?.parse().ok()?;

				match op {
					"nop" => Some(Op::NOP(arg)),
					"jmp" => Some(Op::JMP(arg)),
					"acc" => Some(Op::ACC(arg)),
					_ => None,
				}
			})
			.collect();

		VM { acc: 0, pc: 0, ops }
	}

	fn step(&mut self) -> Result<()> {
		let idx = usize::try_from(self.pc)?;
		let op = self.ops.get(idx).ok_or("out of bounds pc")?;

		let offset = match op {
			Op::ACC(arg) => {
				self.acc += arg;

				1
			}
			Op::NOP(_) => 1,
			Op::JMP(offset) => *offset,
		};

		self.pc += offset;

		Ok(())
	}
}

impl FromStr for VM {
	type Err = Box<dyn std::error::Error>;

	fn from_str(s: &str) -> Result<Self> {
		Ok(VM::new(s))
	}
}

fn part1(input: &str) -> Result<i32> {
	let mut vm: VM = input.parse()?;

	let mut visited: HashSet<i32> = HashSet::new();

	while !visited.contains(&vm.pc) {
		visited.insert(vm.pc);
		vm.step()?
	}

	Ok(vm.acc)
}

fn part2(input: String) -> Result<i32> {
	let max = input.lines().count();

	let vm_results: Vec<i32> = (0..max)
		.filter_map(|line_index| {
			let input = input.clone();
			let mut vm: VM = input.parse().ok()?;

			let op = vm.ops.get_mut(line_index)?;

			*op = match op {
				Op::JMP(arg) => Op::NOP(*arg),
				Op::NOP(arg) => Op::JMP(*arg),
				Op::ACC(_) => return None,
			};

			let mut visited: HashSet<i32> = HashSet::new();

			loop {
				if visited.contains(&vm.pc) {
					return None;
				}

				visited.insert(vm.pc);
				if !vm.step().is_ok() {
					return None;
				}

				if vm.pc == i32::try_from(max).ok()? {
					return Some(vm.acc);
				}
			}
		})
		.collect();

	let acc = vm_results.get(0).ok_or("no result found")?;

	Ok(*acc)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d08/input.txt")?;

	println!("{:?}", part1(&input)?);
	println!("{:?}", part2(input)?);

	Ok(())
}
