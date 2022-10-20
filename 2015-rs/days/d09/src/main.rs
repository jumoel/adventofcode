use itertools::Itertools;
use std::collections::{HashMap, HashSet};
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

type FlightTimes = HashMap<(String, String), usize>;

fn calculate_distances(flighttimes: &FlightTimes) -> Vec<usize> {
	let cities: HashSet<String> =
		HashSet::from_iter(flighttimes.keys().map(|(from, _)| from.to_string()));

	cities
		.iter()
		.permutations(cities.len())
		.map(|plan| {
			plan.windows(2)
				.map(|leg| match leg {
					[from, to] => flighttimes[&(from.to_string(), to.to_string())],
					_ => panic!("Windows doesn't work"),
				})
				.sum()
		})
		.collect::<Vec<_>>()
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d09/input.txt")?;

	let input: FlightTimes = input
		.lines()
		.map(|line| {
			let parts = line.split(" ").collect::<Vec<_>>();

			match parts.as_slice() {
				[from, "to", to, "=", dist] => {
					let dist = dist
						.parse::<usize>()
						.expect(&format!("Invalid dist format: {}", dist));

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

	let distances = calculate_distances(&input);

	println!("Part 1: {}", distances.iter().min().unwrap());
	println!("Part 2: {}", distances.iter().max().unwrap());

	Ok(())
}
