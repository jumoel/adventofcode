use std::fs;

use itertools::Itertools;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d17/input.txt")?;

	let buckets = input
		.lines()
		.filter_map(|line| i32::from_str_radix(line, 10).ok())
		.sorted()
		.collect::<Vec<_>>();

	let storage = 150;

	let permutations = (1..=buckets.len())
		.map(|i| buckets.iter().combinations(i).collect::<Vec<_>>())
		.flatten()
		.filter(|p| p.iter().fold(0, |acc, e| acc + **e) == storage)
		.collect::<Vec<_>>();

	let min_containers = permutations
		.iter()
		.map(|f| f.len())
		.sorted()
		.next()
		.ok_or("Finding minimum cointainer count failed")?;

	let part2 = permutations
		.iter()
		.filter(|f| f.len() == min_containers)
		.count();

	println!("Part 1: {}", permutations.len());
	println!("Part 2: {}", part2);

	Ok(())
}
