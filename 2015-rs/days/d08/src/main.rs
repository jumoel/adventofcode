use regex::Regex;
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(lines: &Vec<&str>) -> usize {
	let res = [r#"(\\\\|\\")"#, r"\\x[a-z0-9]{2}"]
		.map(|pattern| Regex::new(pattern).unwrap())
		.to_vec();

	lines
		.into_iter()
		.map(|line| {
			let line_truncated: String = line.chars().skip(1).take(line.len() - 2).collect();

			let line_truncated = res.iter().fold(line_truncated, |acc, re| {
				re.replace_all(&acc, "x").to_string()
			});

			line.len() - line_truncated.len()
		})
		.sum()
}

fn part2(lines: &Vec<&str>) -> usize {
	lines
		.into_iter()
		.map(|line| serde_json::to_string(line).unwrap().len() - line.len())
		.sum()
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2015/8/input.txt")?;

	let input: Vec<&str> = input.lines().collect();

	println!("Part 1: {}", part1(&input));
	println!("Part 2: {}", part2(&input));

	Ok(())
}
