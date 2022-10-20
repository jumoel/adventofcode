use std::fs;

use itertools::FoldWhile::{Continue, Done};
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

	let part1 = permutations.len();

	let part2 = permutations
		.iter()
		.map(|f| f.len())
		.sorted()
		.fold_while((0, 0), |(count, prev), curr| {
			if prev == 0 || curr == prev {
				Continue((count + 1, curr))
			} else {
				Done((count, 0))
			}
		})
		.into_inner()
		.0;

	println!("Part 1: {}", part1);
	println!("Part 2: {}", part2);

	Ok(())
}
