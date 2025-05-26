use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

const TREE: char = '#';

fn slope(map: &str, dx: usize, dy: usize) -> Result<i32> {
	let mut trees = 0;

	let mut offset: usize = 0;

	let width =
		map.lines().nth(0).ok_or("invalid data")?.chars().count();

	for line in map.lines().step_by(dy) {
		let coord =
			line.chars().nth(offset).ok_or("invalid offset")?;

		if coord == TREE {
			trees += 1;
		}

		offset = (offset + dx) % width;
	}

	Ok(trees)
}

fn part1(map: &str) -> Result<i32> {
	slope(&map, 3, 1)
}

fn part2(map: &str) -> Result<i32> {
	let parts = vec![
		slope(&map, 1, 1)?,
		slope(&map, 3, 1)?,
		slope(&map, 5, 1)?,
		slope(&map, 7, 1)?,
		slope(&map, 1, 2)?,
	];

	Ok(parts.iter().fold(1, |acc, v| acc * v))
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2020/3/input.txt")?;

	println!("{:?}", part1(&input)?);
	println!("{:?}", part2(&input)?);

	Ok(())
}
