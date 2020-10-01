use std::fs;

type Range = (usize, usize);
type From = Range;
type To = Range;
const DIM: usize = 1000;

enum Operation {
	TurnOff(From, To),
	TurnOn(From, To),
	Toggle(From, To),
}

fn str_to_range(s: &str) -> Range {
	match s.split(",").collect::<Vec<&str>>()[..] {
		[f, t] => {
			(f.parse::<usize>().unwrap(), t.parse::<usize>().unwrap())
		}
		_ => panic!("Invalid range"),
	}
}

fn part1(input: std::slice::Iter<Operation>) -> i32 {
	fn op_off(_: bool) -> bool {
		false
	}

	fn op_on(_: bool) -> bool {
		true
	}

	fn op_toggle(current: bool) -> bool {
		!current
	}

	let mut lights = [[false; DIM]; DIM];

	for op in input {
		let ((x_f, y_f), (x_t, y_t), op_fn): (
			Range,
			Range,
			fn(bool) -> bool,
		) = match op {
			Operation::TurnOff(f, t) => (*f, *t, op_off),
			Operation::TurnOn(f, t) => (*f, *t, op_on),
			Operation::Toggle(f, t) => (*f, *t, op_toggle),
		};

		for y in y_f..(y_t + 1) {
			for x in x_f..(x_t + 1) {
				lights[y][x] = op_fn(lights[y][x])
			}
		}
	}

	let mut count = 0;
	for y in 0..DIM {
		for x in 0..DIM {
			count += if lights[y][x] { 1 } else { 0 };
		}
	}

	count
}

fn part2(input: std::slice::Iter<Operation>) -> i32 {
	fn op_off(current: i32) -> i32 {
		std::cmp::max(current - 1, 0)
	}

	fn op_on(current: i32) -> i32 {
		current + 1
	}

	fn op_toggle(current: i32) -> i32 {
		current + 2
	}

	let mut lights = [[0; DIM]; DIM];

	for op in input {
		let ((x_f, y_f), (x_t, y_t), op_fn): (
			Range,
			Range,
			fn(i32) -> i32,
		) = match op {
			Operation::TurnOff(f, t) => (*f, *t, op_off),
			Operation::TurnOn(f, t) => (*f, *t, op_on),
			Operation::Toggle(f, t) => (*f, *t, op_toggle),
		};

		for y in y_f..(y_t + 1) {
			for x in x_f..(x_t + 1) {
				lights[y][x] = op_fn(lights[y][x])
			}
		}
	}

	let mut count = 0;
	for y in 0..DIM {
		for x in 0..DIM {
			count += lights[y][x]
		}
	}

	count
}

fn main() {
	let input = fs::read_to_string("d06/input.txt")
		.expect("Something went wrong reading the file");

	let input: Vec<Operation> = input
		.lines()
		.filter_map(|line| {
			let parts = line.split(" ").collect::<Vec<&str>>();

			match parts.as_slice() {
				["turn", "on", from, "through", to] => {
					Some(Operation::TurnOn(
						str_to_range(from),
						str_to_range(to),
					))
				}
				["turn", "off", from, "through", to] => {
					Some(Operation::TurnOff(
						str_to_range(from),
						str_to_range(to),
					))
				}
				["toggle", from, "through", to] => {
					Some(Operation::Toggle(
						str_to_range(from),
						str_to_range(to),
					))
				}
				_ => None,
			}
		})
		.collect();

	println!("Part 1: {}", part1(input.iter()));
	println!("Part 2: {}", part2(input.iter()));
}
