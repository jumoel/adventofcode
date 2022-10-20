use std::fs;

type Range = (usize, usize);
type From = Range;
type To = Range;
const DIM: usize = 1000;
type Lights<T> = [[T; DIM]; DIM];
type ModFn<T> = fn(&mut T) -> T;

enum Operation {
	TurnOff(From, To),
	TurnOn(From, To),
	Toggle(From, To),
}

fn str_to_range(s: &str) -> Range {
	match s.split(",").collect::<Vec<&str>>()[..] {
		[f, t] => (f.parse::<usize>().unwrap(), t.parse::<usize>().unwrap()),
		_ => panic!("Invalid range"),
	}
}

fn part<T>(
	input: std::slice::Iter<Operation>,
	lights: &mut Lights<T>,
	op_off: ModFn<T>,
	op_on: ModFn<T>,
	op_toggle: ModFn<T>,
	sum: fn(&T) -> i32,
) -> i32 {
	for op in input {
		let ((x_f, y_f), (x_t, y_t), op_fn): (Range, Range, ModFn<T>) = match op {
			Operation::TurnOff(f, t) => (*f, *t, op_off),
			Operation::TurnOn(f, t) => (*f, *t, op_on),
			Operation::Toggle(f, t) => (*f, *t, op_toggle),
		};

		for y in y_f..=y_t {
			for x in x_f..=x_t {
				let cell = lights.get_mut(y).unwrap().get_mut(x).unwrap();
				*cell = op_fn(cell)
			}
		}
	}

	let mut count = 0;
	for y in 0..DIM {
		for x in 0..DIM {
			let val = lights.get(y).unwrap().get(x).unwrap();
			count += sum(val);
		}
	}

	count
}

fn part1(input: std::slice::Iter<Operation>) -> i32 {
	fn op_off(_: &mut bool) -> bool {
		false
	}

	fn op_on(_: &mut bool) -> bool {
		true
	}

	fn op_toggle(current: &mut bool) -> bool {
		!*current
	}

	fn sum(current: &bool) -> i32 {
		if *current {
			1
		} else {
			0
		}
	}

	let mut lights: Lights<bool> = [[false; DIM]; DIM];

	part::<bool>(input, &mut lights, op_off, op_on, op_toggle, sum)
}

fn part2(input: std::slice::Iter<Operation>) -> i32 {
	fn op_off(current: &mut i32) -> i32 {
		std::cmp::max(*current - 1, 0)
	}

	fn op_on(current: &mut i32) -> i32 {
		*current + 1
	}

	fn op_toggle(current: &mut i32) -> i32 {
		*current + 2
	}

	fn sum(current: &i32) -> i32 {
		*current
	}

	let mut lights: Lights<i32> = [[0; DIM]; DIM];

	part::<i32>(input, &mut lights, op_off, op_on, op_toggle, sum)
}

fn main() {
	let input =
		fs::read_to_string("days/d06/input.txt").expect("Something went wrong reading the file");

	let input: Vec<Operation> = input
		.lines()
		.filter_map(|line| {
			let parts = line.split(" ").collect::<Vec<&str>>();

			match parts.as_slice() {
				["turn", "on", from, "through", to] => {
					Some(Operation::TurnOn(str_to_range(from), str_to_range(to)))
				}
				["turn", "off", from, "through", to] => {
					Some(Operation::TurnOff(str_to_range(from), str_to_range(to)))
				}
				["toggle", from, "through", to] => {
					Some(Operation::Toggle(str_to_range(from), str_to_range(to)))
				}
				_ => None,
			}
		})
		.collect();

	println!("Part 1: {}", part1(input.iter()));
	println!("Part 2: {}", part2(input.iter()));
}
