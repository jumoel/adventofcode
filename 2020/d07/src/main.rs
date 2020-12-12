use regex::Regex;
use std::{collections::HashMap, fs};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

type Rule<'a> = (i32, &'a str);
type RuleMap<'a> = HashMap<&'a str, Vec<Rule<'a>>>;

fn part1(bags: &RuleMap) -> i32 {
	fn can_contain(bags: &RuleMap, color: &str) -> Option<bool> {
		let inner = bags.get(color)?;

		let res = inner
			.iter()
			.filter_map(|(_, c)| {
				let inside = can_contain(bags, c)?;
				let this = *c == "shiny gold";

				Some(this || inside)
			})
			.any(|x| x);

		Some(res)
	}

	bags.keys()
		.filter_map(|color| {
			if can_contain(&bags, color)? {
				Some(1)
			} else {
				Some(0)
			}
		})
		.sum()
}

fn part2(bags: &RuleMap) -> i32 {
	fn bag_count(color: &str, bags: &RuleMap) -> i32 {
		match bags.get(color) {
			None => 0,
			Some(inner) => inner
				.iter()
				.map(|(count, c)| count * (1 + bag_count(c, bags)))
				.sum(),
		}
	}

	bag_count("shiny gold", bags)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d07/input.txt")?;
	let rule_re = Regex::new("^\\s*(\\d)+ (.+) bags?\\.?$")?;

	let bags: RuleMap = input
		.lines()
		.filter_map(|line| {
			let mut parts = line.split("bags contain").fuse();

			match (parts.next(), parts.next()) {
				(Some(outer), Some(inner_raw)) => {
					let outer = outer.trim();
					let inner: Vec<Rule> = inner_raw
						.split(",")
						.filter_map(|s| {
							let caps = rule_re.captures(s)?;

							let count = caps
								.get(1)?
								.as_str()
								.parse::<i32>()
								.ok()?;
							let color = caps.get(2)?.as_str();

							Some((count, color))
						})
						.collect();

					Some((outer, inner))
				}
				_ => None,
			}
		})
		.collect();

	println!("{:?}", part1(&bags));
	println!("{:?}", part2(&bags));

	Ok(())
}
