use std::fs;

use regex::Regex;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(input: &str) -> Result<i32> {
	let re = Regex::new(r"(-?\d+)")?;

	re.captures_iter(&input).fold(Ok(0), |acc, c| {
		match i32::from_str_radix(&c[1], 10) {
			Ok(n) => Ok(acc? + n),
			_ => acc,
		}
	})
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d12/input.txt")?;

	println!("{:?}", part1(&input)?);

	Ok(())
}
