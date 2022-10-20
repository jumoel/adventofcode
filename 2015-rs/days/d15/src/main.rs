use std::fs;

use itertools::Itertools;
use regex::{Match, Regex};

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d15/input.txt")?;

	/*
	Frosting: capacity 4, durability -2, flavor 0, texture 0, calories 5
	Candy: capacity 0, durability 5, flavor -1, texture 0, calories 8
	Butterscotch: capacity -1, durability 0, flavor 5, texture 0, calories 6
	Sugar: capacity 0, durability 0, flavor -2, texture 2, calories 1

		*/
	let re = Regex::new(r"(-?\d+)[,a-z ]+(-?\d+)[,a-z ]+(-?\d+)[,a-z ]+(-?\d+)[,a-z ]+(-?\d+)")?;

	fn ingredient(m: Match) -> i32 {
		i32::from_str_radix(m.as_str(), 10).unwrap_or(0)
	}

	let ingredients = input
		.lines()
		.filter_map(|line| {
			re.captures(line).and_then(|caps| {
				match (
					caps.get(1),
					caps.get(2),
					caps.get(3),
					caps.get(4),
					caps.get(5),
				) {
					(Some(c), Some(d), Some(f), Some(t), Some(cal)) => Some(vec![
						ingredient(c),
						ingredient(d),
						ingredient(f),
						ingredient(t),
						ingredient(cal),
					]),
					_ => None,
				}
			})
		})
		.collect::<Vec<_>>();

	let tsp_max = 100;

	let ingredient_combinations = (0..=tsp_max)
		.combinations_with_replacement(ingredients.len())
		.filter(|f| f.iter().sum::<i32>() == tsp_max)
		.map(|size_combi| {
			size_combi
				.into_iter()
				.permutations(ingredients.len())
				.unique()
		})
		.flatten()
		.collect::<Vec<_>>();

	fn sum_property(ingredients: &Vec<Vec<i32>>, combi: &Vec<i32>, i: usize) -> i32 {
		combi
			.iter()
			.enumerate()
			.filter_map(|(index, size)| {
				let ing = ingredients.get(index)?;
				let score = ing.get(i)?;

				Some(score * size)
			})
			.sum::<i32>()
			.max(0)
	}

	let part1 = ingredient_combinations
		.iter()
		.map(|combi| {
			let capacity = sum_property(&ingredients, combi, 0);
			let durability = sum_property(&ingredients, combi, 1);
			let flavor = sum_property(&ingredients, combi, 2);
			let texture = sum_property(&ingredients, combi, 3);

			capacity * durability * flavor * texture
		})
		.max()
		.ok_or("Part1 failed")?;

	println!("Part 1: {}", part1);

	Ok(())
}
