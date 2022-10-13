use std::cmp::{max, min};
use std::fs;

fn main() {
	let input = fs::read_to_string("days/d02/input.txt")
		.expect("Something went wrong reading the file");

	let input_clean = input
		.lines()
		.map(|l| {
			let parts = l
				.split("x")
				.map(|p| {
					p.parse::<i32>().expect("Invalid input types")
				})
				.collect::<Vec<i32>>();

			if parts.len() != 3 {
				return None;
			}

			Some((parts[0], parts[1], parts[2]))
		})
		.map(|v| v.expect("Invalid input length"))
		.collect::<Vec<(i32, i32, i32)>>();

	let part1: i32 = input_clean
		.iter()
		.map(|(w, h, l)| {
			let a = w * h;
			let b = w * l;
			let c = h * l;

			2 * a + 2 * b + 2 * c + min(a, min(b, c))
		})
		.sum();

	println!("Part 1: {}", part1);

	let part2: i32 = input_clean
		.iter()
		.map(|(w, d, h)| {
			w * d * h + 2 * w + 2 * h + 2 * d - 2 * max(w, max(d, h))
		})
		.sum();

	println!("Part 2: {}", part2);
}
