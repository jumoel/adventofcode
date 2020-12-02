use std::fs;

fn main() {
	let input = fs::read_to_string("d01/input.txt")
		.expect("Something went wrong reading the file");

	let mut lines: Vec<i32> = input
		.split('\n')
		.map(|f| f.parse::<i32>())
		.filter_map(|f| f.ok())
		.collect();

	lines.sort();

	let mut iter = lines.iter();

	let res: i32 = 'outer: loop {
		let front = iter.next().unwrap();

		loop {
			let back = iter.next_back().unwrap();

			let sum = front + back;

			if sum == 2020 {
				break 'outer front * back;
			} else if sum < 2020 {
				break;
			}
		}
	};

	println!("{:?}", res);
}
