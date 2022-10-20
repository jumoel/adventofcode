use std::{collections::HashMap, fs};

use regex::Regex;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn finder(
	clues: &HashMap<&str, i32>,
	sues: &Vec<(i32, HashMap<&str, i32>)>,
	func: Box<dyn Fn(&str, &i32, &i32) -> Option<()>>,
) -> Result<i32> {
	let sue = sues
		.iter()
		.map(|(num, mem)| {
			let matching_clues = clues
				.iter()
				.filter_map(|(sue_clue, count)| {
					let clue_val = mem.get(sue_clue)?;

					func(*sue_clue, clue_val, count)
				})
				.count();

			(num, matching_clues)
		})
		.max_by_key(|s| s.1)
		.ok_or("Part 1 failed")?;

	Ok(*sue.0)
}

fn part1(clues: &HashMap<&str, i32>, sues: &Vec<(i32, HashMap<&str, i32>)>) -> Result<i32> {
	finder(
		clues,
		sues,
		Box::new(
			|_: &str, clue_val: &i32, count: &i32| {
				if clue_val == count {
					Some(())
				} else {
					None
				}
			},
		),
	)
}

fn part2(clues: &HashMap<&str, i32>, sues: &Vec<(i32, HashMap<&str, i32>)>) -> Result<i32> {
	finder(
		clues,
		sues,
		Box::new(
			|sue_clue: &str, clue_val: &i32, count: &i32| match sue_clue {
				"cats" if clue_val > count => Some(()),
				"trees" if clue_val > count => Some(()),
				"pomeranians" if clue_val < count => Some(()),
				"goldfish" if clue_val < count => Some(()),
				_ if clue_val == count => Some(()),
				_ => None,
			},
		),
	)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d16/input.txt")?;

	let sue_re = Regex::new(r"Sue (\d+):")?;
	let clue_re = Regex::new(r" ((\w+): (\d+))")?;

	let sues = input
		.lines()
		.filter_map(|line| {
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
		})
		.collect::<Vec<_>>();

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

	println!("Part 1: {}", part1(&clues, &sues)?);
	println!("Part 2: {}", part2(&clues, &sues)?);

	Ok(())
}
