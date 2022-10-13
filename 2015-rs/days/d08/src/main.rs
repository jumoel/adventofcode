use std::fs;

use regex::Regex;

fn main() {
	let input = fs::read_to_string("days/d08/input.txt")
		.expect("Something went wrong reading the file");

	let res = [r#"(\\\\|\\")"#, r"\\x[a-z0-9]{2}"]
		.map(|pattern| Regex::new(pattern).unwrap())
		.to_vec();

	let input: usize = input
		.lines()
		.filter_map(|line| {
			let line_truncated: String =
				line.chars().skip(1).take(line.len() - 2).collect();

			let line_truncated =
				res.iter().fold(line_truncated, |acc, re| {
					re.replace_all(&acc, "x".to_string()).to_string()
				});

			Some(line.len() - line_truncated.len())
		})
		.sum();

	println!("Part 1: {}", input);
}
