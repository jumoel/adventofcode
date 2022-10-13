use std::{collections::HashMap, fs};

type Wire = String;
type Val = u16;
type Ops = HashMap<Wire, Operation>;
type Vals = HashMap<Wire, Val>;

#[derive(Debug)]
enum Operation {
	SET(Wire),
	SETIMM(Val),
	RSHIFT(Wire, Val),
	LSHIFT(Wire, Val),
	NOT(Wire),
	AND(Wire, Wire),
	OR(Wire, Wire),
}

fn ins(values: &mut Vals, w: Wire, val: Val) -> Val {
	values.insert(w, val);

	val
}

fn process_wire(w: Wire, values: &mut Vals, ops: &Ops) -> Val {
	match ops.get(&w) {
		Some(Operation::SETIMM(val)) => ins(values, w, *val),

		Some(Operation::SET(wire)) => {
			let val = get_wire(wire.to_string(), values, ops);
			ins(values, w, val)
		}

		Some(Operation::RSHIFT(wire, modifier)) => {
			let val =
				get_wire(wire.to_string(), values, ops) >> modifier;
			ins(values, w, val)
		}

		Some(Operation::LSHIFT(wire, modifier)) => {
			let val =
				get_wire(wire.to_string(), values, ops) << modifier;

			ins(values, w, val)
		}

		Some(Operation::AND(wire1, wire2)) => {
			let val1 = get_wire(wire1.to_string(), values, ops);
			let val2 = get_wire(wire2.to_string(), values, ops);

			ins(values, w, val1 & val2)
		}

		Some(Operation::OR(wire1, wire2)) => {
			let val1 = get_wire(wire1.to_string(), values, ops);
			let val2 = get_wire(wire2.to_string(), values, ops);

			ins(values, w, val1 | val2)
		}

		Some(Operation::NOT(wire)) => {
			let val = get_wire(wire.to_string(), values, ops);

			ins(values, w, !val)
		}

		None => panic!("Invalid operation"),
	}
}

fn get_wire(w: Wire, values: &mut Vals, ops: &Ops) -> Val {
	match w.parse() {
		Ok(val) => val,
		_ => match values.get(&w) {
			Some(val) => *val,
			_ => process_wire(w.to_string(), values, ops),
		},
	}
}

fn part1(input: &Ops) -> Val {
	let mut values: Vals = HashMap::new();

	get_wire("a".to_string(), &mut values, input)
}

fn main() {
	let input = fs::read_to_string("days/d07/input.txt")
		.expect("Something went wrong reading the file");

	let input: Ops = input
		.lines()
		.filter_map(|line| {
			let parts = line.split(" ").collect::<Vec<&str>>();

			match parts.as_slice() {
				[val, "->", out] => match val.parse() {
					Ok(val) => Some((
						out.to_string(),
						Operation::SETIMM(val),
					)),
					_ => Some((
						out.to_string(),
						Operation::SET(val.to_string()),
					)),
				},

				[w1, "RSHIFT", val, "->", out] => Some((
					out.to_string(),
					Operation::RSHIFT(
						w1.to_string(),
						val.parse().unwrap(),
					),
				)),

				[w1, "LSHIFT", val, "->", out] => Some((
					out.to_string(),
					Operation::LSHIFT(
						w1.to_string(),
						val.parse().unwrap(),
					),
				)),

				[w1, "AND", w2, "->", out] => Some((
					out.to_string(),
					Operation::AND(w1.to_string(), w2.to_string()),
				)),

				[w1, "OR", w2, "->", out] => Some((
					out.to_string(),
					Operation::OR(w1.to_string(), w2.to_string()),
				)),

				["NOT", w1, "->", out] => Some((
					out.to_string(),
					Operation::NOT(w1.to_string()),
				)),

				_ => None,
			}
		})
		.collect();

	println!("Part 1: {}", part1(&input));
	// println!("Part 2: {}", part2(input.iter()));
}
