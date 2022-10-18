use std::{
	collections::{HashMap, HashSet},
	fs,
};

use itertools::Itertools;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d13/input.txt")?;

	let (happiness, guests) = input.lines().fold(
		(HashMap::new(), HashSet::new()),
		|(mut happiness, mut guests), line| {
			match line
				.replace("would ", "")
				.replace("happiness units by sitting next to ", "")
				.replace(".", "")
				.split(" ")
				.collect::<Vec<_>>()
				.as_slice()
			{
				[name, op, val, neighbor] => {
					let val = i32::from_str_radix(val, 10)
						.expect("Invalid integer");

					let sign = if *op == "gain" { 1 } else { -1 };

					guests.insert(name.to_string());
					happiness.insert(
						(name.to_string(), neighbor.to_string()),
						sign * val,
					);
				}

				_ => {}
			};

			(happiness, guests)
		},
	);

	let part1 = guests
		.iter()
		.permutations(guests.len())
		.map(|permutation| {
			permutation
				.iter()
				.circular_tuple_windows::<(_, _)>()
				.map(|(n1, n2)| {
					let p1 = happiness
						.get(&(n1.to_string(), n2.to_string()))
						.unwrap_or(&0);

					let p2 = happiness
						.get(&(n2.to_string(), n1.to_string()))
						.unwrap_or(&0);

					p1 + p2
				})
				.sum::<i32>()
		})
		.max()
		.unwrap_or(0);

	println!("Part 1: {}", part1);

	Ok(())
}
