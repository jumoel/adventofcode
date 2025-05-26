use std::{collections::HashMap, fs};

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

type Wire = String;
type Val = u16;
type Ops = HashMap<Wire, Operation>;
type Vals = HashMap<Wire, Val>;

#[derive(Debug)]
enum Operation {
	SET(Wire),
	RSHIFT(Wire, Val),
	LSHIFT(Wire, Val),
	NOT(Wire),
	AND(Wire, Wire),
	OR(Wire, Wire),
}

fn process_wire(w: &Wire, values: &mut Vals, ops: &Ops) -> Val {
	let val = match &ops[w] {
		Operation::SET(wire) => get_wire(wire, values, ops),

		Operation::RSHIFT(wire, modifier) => get_wire(wire, values, ops) >> modifier,

		Operation::LSHIFT(wire, modifier) => get_wire(wire, values, ops) << modifier,

		Operation::AND(wire1, wire2) => get_wire(wire1, values, ops) & get_wire(wire2, values, ops),

		Operation::OR(wire1, wire2) => get_wire(wire1, values, ops) | get_wire(wire2, values, ops),

		Operation::NOT(wire) => !get_wire(wire, values, ops),
	};

	values.insert(w.to_string(), val);

	val
}

fn get_wire(w: &Wire, values: &mut Vals, ops: &Ops) -> Val {
	match w.parse() {
		Ok(val) => val,
		_ => match values.get(w) {
			Some(val) => *val,
			_ => process_wire(w, values, ops),
		},
	}
}

fn part1(input: &Ops) -> Val {
	let mut values: Vals = HashMap::new();

	get_wire(&"a".to_string(), &mut values, input)
}

fn part2(input: &mut Ops) -> Val {
	let b_val = part1(input);

	input.insert("b".to_string(), Operation::SET(b_val.to_string()));
	let mut values: Vals = HashMap::new();

	get_wire(&"a".to_string(), &mut values, input)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2015/7/input.txt")?;

	let mut input: Ops = input
		.lines()
		.map(|line| {
			let parts = line.split(" ").collect::<Vec<&str>>();

			match parts.as_slice() {
				[val, "->", out] => (out.to_string(), Operation::SET(val.to_string())),

				[w1, "RSHIFT", val, "->", out] => (
					out.to_string(),
					Operation::RSHIFT(w1.to_string(), val.parse().unwrap()),
				),

				[w1, "LSHIFT", val, "->", out] => (
					out.to_string(),
					Operation::LSHIFT(w1.to_string(), val.parse().unwrap()),
				),

				[w1, "AND", w2, "->", out] => (
					out.to_string(),
					Operation::AND(w1.to_string(), w2.to_string()),
				),

				[w1, "OR", w2, "->", out] => (
					out.to_string(),
					Operation::OR(w1.to_string(), w2.to_string()),
				),

				["NOT", w1, "->", out] => (out.to_string(), Operation::NOT(w1.to_string())),

				_ => panic!("Unsupported line: {}", line),
			}
		})
		.collect();

	println!("Part 1: {}", part1(&input));
	println!("Part 2: {}", part2(&mut input));

	Ok(())
}
