use std::{collections::HashSet, fs};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("d06/input.txt")?;

	let part1: usize = input
		.split("\n\n")
		.map(|group| {
			group
				.chars()
				.filter(|c| *c != '\n')
				.collect::<HashSet<char>>()
				.len()
		})
		.sum();

	println!("{:?}", part1);

	Ok(())
}
