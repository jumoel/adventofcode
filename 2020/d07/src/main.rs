use std::{collections::HashMap, fs};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(bags: &HashMap<&str, Vec<String>>) -> i32 {
	fn can_contain(
		bags: &HashMap<&str, Vec<String>>,
		color: &str,
	) -> bool {
		match bags.get(color) {
			Some(inner) => inner
				.iter()
				.any(|c| c == "shiny gold" || can_contain(bags, c)),
			None => false,
		}
	}

	bags.keys().fold(0, |count, color| {
		if can_contain(&bags, color) {
			count + 1
		} else {
			count
		}
	})
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d07/input.txt")?;

	let bags: HashMap<&str, Vec<String>> = input
		.lines()
		.filter_map(|line| {
			let mut parts = line.split("bags contain").fuse();

			match (parts.next(), parts.next()) {
				(Some(outer), Some(inner_raw)) => {
					let outer = outer.trim();
					let inner: Vec<String> = inner_raw
						.split(",")
						.map(|s| {
							s.replace("bags", "")
								.replace("bag", "")
								.trim_matches(|c: char| {
									c.is_numeric()
										|| c.is_ascii_whitespace() || c
										== '.'
								})
								.to_string()
						})
						.filter(|s| s != "no other")
						.collect();

					Some((outer, inner))
				}
				_ => None,
			}
		})
		.collect();

	println!("{:?}", part1(&bags));

	Ok(())
}
