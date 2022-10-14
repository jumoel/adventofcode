use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(flighttimes: &HashMap<(String, String), usize>) -> usize {
	let cities: HashSet<String> = HashSet::from_iter(
		flighttimes.keys().map(|(from, _)| from.to_string()),
	);

	cities
		.iter()
		.permutations(cities.len())
		.map(|plan| {
			plan.windows(2)
				.map(|leg| match leg {
					[from, to] => {
						flighttimes
							[&(from.to_string(), to.to_string())]
					}
					_ => panic!("Windows doesn't work"),
				})
				.sum()
		})
		.min()
		.unwrap()
}

// fn part2(lines: &Vec<&str>) -> usize {
// }

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d09/input.txt")?;

	let input: HashMap<(String, String), usize> = input
		.lines()
		.map(|line| {
			let parts = line.split(" ").collect::<Vec<_>>();

			match parts.as_slice() {
				[from, "to", to, "=", dist] => {
					let dist = dist.parse::<usize>().expect(
						&format!("Invalid dist format: {}", dist),
					);

					[
						((from.to_string(), to.to_string()), dist),
						((to.to_string(), from.to_string()), dist),
					]
				}
				_ => panic!("Unexpected line format: {}", line),
			}
		})
		.flatten()
		.collect();

	println!("Part 1: {}", part1(&input));
	// println!("Part 2: {}", part2(&input));

	Ok(())
}
