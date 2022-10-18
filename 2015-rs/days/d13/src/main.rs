use core::panic;
use std::{
	collections::{HashMap, HashSet},
	fs,
};

use itertools::Itertools;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn max_happiness(
	happiness: &HashMap<(String, String), i32>,
	guests: &HashSet<String>,
) -> i32 {
	guests
		.iter()
		.permutations(guests.len())
		.map(|permutation| {
			permutation
				.iter()
				.circular_tuple_windows::<(_, _)>()
				.map(|(n1, n2)| {
					let pair1 = happiness
						.get(&(n1.to_string(), n2.to_string()))
						.unwrap_or(&0);

					let pair2 = happiness
						.get(&(n2.to_string(), n1.to_string()))
						.unwrap_or(&0);

					pair1 + pair2
				})
				.sum::<i32>()
		})
		.max()
		.unwrap_or(0)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d13/input.txt")?;

	let happiness = input
		.lines()
		.map(|line| {
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

					(
						(name.to_string(), neighbor.to_string()),
						sign * val,
					)
				}
				_ => panic!("Invalid line format"),
			}
		})
		.collect::<HashMap<(String, String), i32>>();

	let mut guests = happiness
		.iter()
		.map(|((guest, _), _)| guest.to_string())
		.collect::<HashSet<String>>();

	println!("Part 1: {}", max_happiness(&happiness, &guests));

	guests.insert("Myself".to_string());

	println!("Part 2: {}", max_happiness(&happiness, &guests));

	Ok(())
}
