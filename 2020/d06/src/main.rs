use std::{collections::HashSet, fs};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(input: &str) -> usize {
	input
		.split("\n\n")
		.map(|group| {
			group
				.chars()
				.filter(|c| *c != '\n')
				.collect::<HashSet<char>>()
				.len()
		})
		.sum()
}

fn part2(input: &str) -> usize {
	input
		.split("\n\n")
		.map(|group| {
			let mut individual_answers =
				group.split_ascii_whitespace().map(|answers| {
					answers.chars().collect::<HashSet<char>>()
				});

			let first =
				individual_answers.nth(0).unwrap_or(HashSet::new());

			individual_answers
				.fold(first, |mut acc, elem| {
					acc.retain(|p| elem.contains(p));

					acc
				})
				.len()
		})
		.sum()
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d06/input.txt")?;

	println!("{:?}", part1(&input));
	println!("{:?}", part2(&input));

	Ok(())
}
