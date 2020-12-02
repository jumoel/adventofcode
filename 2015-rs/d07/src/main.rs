use std::collections::HashMap;
use std::fs;

enum Dep {
	Wire(String),
	Raw(i32),
}

type Out = String;

enum Op {
	PROVIDE(Dep, Out),
	AND(Dep, Dep, Out),
	OR(Dep, Dep, Out),
	NOT(Dep, Out),
	RSHIFT(Dep, Dep, Out),
	LSHIFT(Dep, Dep, Out),
}

struct Instruction {
	op: Op,
	deps: [Dep],
}

fn dep(input: &str) -> Dep {
	match input.parse::<i32>() {
		Ok(num) => Dep::Raw(num),
		_ => Dep::Wire(input.to_string()),
	}
}

fn main() {
	let input = fs::read_to_string("d07/input.txt")
		.expect("Something went wrong reading the file");

	let wires: HashMap<String, i32> = HashMap::new();

	let instructions = input
		.lines()
		.map(|l| {
			let parts = l.trim().split(" ").collect::<Vec<&str>>();

			match parts[..] {
				[dep1, "AND", dep2, "->", out] => {
					Op::AND(dep(dep1), dep(dep2), out.to_string())
				}
				[dep1, "OR", dep2, "->", out] => {
					Op::OR(dep(dep1), dep(dep2), out.to_string())
				}
				[dep1, "LSHIFT", dep2, "->", out] => {
					Op::LSHIFT(dep(dep1), dep(dep2), out.to_string())
				}
				[dep1, "RSHIFT", dep2, "->", out] => {
					Op::RSHIFT(dep(dep1), dep(dep2), out.to_string())
				}
				["NOT", dep1, "->", out] => {
					Op::NOT(dep(dep1), out.to_string())
				}
				[dep1, "->", out] => {
					Op::PROVIDE(dep(dep1), out.to_string())
				}
				_ => panic!("Unexpected input"),
			}
		})
		.collect::<Vec<Op>>();

	let p1 = 0;

	println!("Part 1: {}", p1);
	println!("Part 2: {}", 0);
}
