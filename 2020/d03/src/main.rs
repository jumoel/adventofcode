use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

const TREE: char = '#';

fn main() -> Result<()> {
	let input = fs::read_to_string("d03/input.txt")?;

	let mut trees = 0;

	let mut offset: usize = 0;

	let width =
		input.lines().nth(0).ok_or("invalid data")?.chars().count();

	for line in input.lines() {
		let coord =
			line.chars().nth(offset).ok_or("invalid offset")?;

		if coord == TREE {
			trees += 1;
		}

		offset = (offset + 3) % width;
	}

	println!("{:?}", trees);
	// println!("{:?}", part2);

	Ok(())
}
