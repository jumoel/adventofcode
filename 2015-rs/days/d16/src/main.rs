use std::{collections::HashMap, fs};

use regex::Regex;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d16/input.txt")?;

	let sue_re = Regex::new(r"Sue (\d+):")?;
	let clue_re = Regex::new(r" ((\w+): (\d+))")?;

	let sues = input.lines().filter_map(|line| {
		let sue = i32::from_str_radix(sue_re.captures(line)?.get(1)?.as_str(), 10).ok()?;
		let clues = clue_re
			.captures_iter(line)
			.filter_map(|cap| {
				let name = cap.get(2)?.as_str();
				let val = i32::from_str_radix(cap.get(3)?.as_str(), 10).ok()?;

				Some((name, val))
			})
			.collect::<HashMap<_, _>>();

		Some((sue, clues))
	});

	let clues = HashMap::from([
		("children", 3),
		("cats", 7),
		("samoyeds", 2),
		("pomeranians", 3),
		("akitas", 0),
		("vizslas", 0),
		("goldfish", 5),
		("trees", 3),
		("cars", 2),
		("perfumes", 1),
	]);

	let part1 = sues
		.map(|(num, mem)| {
			let matching_clues =
				clues
					.iter()
					.filter_map(|(sue_clue, count)| {
						mem.get(sue_clue).and_then(|clue_val| {
							if clue_val == count {
								Some(count)
							} else {
								None
							}
						})
					})
					.count();

			(num, matching_clues)
		})
		.max_by_key(|s| s.1)
		.ok_or("Part 1 failed")?
		.0;

	println!("Part 1: {}", part1);

	Ok(())
}
