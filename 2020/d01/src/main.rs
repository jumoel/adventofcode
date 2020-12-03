use std::{collections::HashSet, fs};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

const TARGET: i32 = 2020;

fn find_pair(s: &HashSet<i32>, val: i32) -> Result<i32> {
	let mut iter = s.iter();

	loop {
		let entry = iter.next().ok_or("No pair found")?;
		let compl = val - entry;

		if s.contains(&compl) {
			println!("Found: {} and {}", entry, compl);
			return Ok(entry * compl);
		}
	}
}

fn part1(s: &HashSet<i32>) -> Result<i32> {
	find_pair(s, TARGET)
}

fn part2(s: &HashSet<i32>) -> Result<i32> {
	let mut iter = s.iter();

	loop {
		let entry = iter.next().ok_or("No triplet found")?;
		let rem = TARGET - entry;

		match find_pair(s, rem) {
			Ok(v) => {
				println!("Found trip: {}", entry);
				return Ok(entry * v);
			}
			Err(_) => (),
		}
	}
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d01/input.txt")?;

	let entries: HashSet<i32> =
		input.lines().map(|l| l.parse()).flatten().collect();

	let part1: i32 = part1(&entries)?;
	let part2: i32 = part2(&entries)?;

	println!("{:?}", part1);
	println!("{:?}", part2);

	Ok(())
}
