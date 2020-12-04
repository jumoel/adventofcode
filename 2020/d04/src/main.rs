#[macro_use]
extern crate lazy_static;

use regex::Regex;
use std::collections::{HashMap, HashSet};
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn validate1(passport: &&str, reqs: &Vec<&str>) -> bool {
	let parts: HashSet<&str> = passport
		.split_ascii_whitespace()
		.map(|part| part.split(":").nth(0).unwrap())
		.collect();

	reqs.iter().all(|field| parts.contains(field))
}

fn part1(passports: &Vec<&str>, reqs: &Vec<&str>) -> usize {
	passports.iter().fold(0, |acc, p| {
		if validate1(&p, reqs) {
			acc + 1
		} else {
			acc
		}
	})
}

fn string_num_range(str: &str, min: i32, max: i32) -> bool {
	let parsed = str.parse::<i32>();

	match parsed {
		Ok(val) => val >= min && val <= max,
		_ => false,
	}
}

fn validate2(passport: &&str, reqs: &Vec<&str>) -> bool {
	let parts: HashMap<&str, &str> = passport
		.split_ascii_whitespace()
		.map(|part| {
			let fields: Vec<&str> = part.split(":").collect();

			(fields[0], fields[1])
		})
		.collect();

	let all_present =
		reqs.iter().all(|field| parts.contains_key(field));

	if !all_present {
		return false;
	}

	lazy_static! {
		static ref RE_4DIG: Regex = Regex::new("^\\d{4}$").unwrap();
		static ref RE_9DIG: Regex = Regex::new("^\\d{9}$").unwrap();
		static ref RE_HEX: Regex =
			Regex::new("^#[0-9a-zA-Z]{6}$").unwrap();
		static ref RE_EYE: Regex =
			Regex::new("^(amb|blu|brn|gry|grn|hzl|oth)$").unwrap();
		static ref RE_HGT_CM: Regex =
			Regex::new("^1([5-8][0-9]|9[0-3])cm$").unwrap();
		static ref RE_HGT_IN: Regex =
			Regex::new("^(59|6[0-9]|7[0-6])in$").unwrap();
	}

	parts.iter().all(|(key, value)| match *key {
		"byr" => {
			value.len() == 4
				&& RE_4DIG.is_match(value)
				&& string_num_range(value, 1920, 2002)
		}
		"iyr" => {
			value.len() == 4
				&& RE_4DIG.is_match(value)
				&& string_num_range(value, 2010, 2020)
		}
		"eyr" => {
			value.len() == 4
				&& RE_4DIG.is_match(value)
				&& string_num_range(value, 2020, 2030)
		}
		"hgt" => {
			RE_HGT_CM.is_match(value) || RE_HGT_IN.is_match(value)
		}
		"hcl" => RE_HEX.is_match(value),
		"ecl" => RE_EYE.is_match(value),
		"pid" => RE_9DIG.is_match(value),
		"cid" => true,
		_ => false,
	})
}

fn part2(passports: &Vec<&str>, reqs: &Vec<&str>) -> Result<usize> {
	let count = passports.iter().fold(0, |acc, p| {
		if validate2(p, reqs) {
			acc + 1
		} else {
			acc
		}
	});

	Ok(count)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d04/input.txt")?;

	let passports: Vec<&str> = input.split("\n\n").collect();
	let reqs: Vec<&str> =
		vec!["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

	let part1 = part1(&passports, &reqs);
	let part2 = part2(&passports, &reqs)?;

	println!("{:?}", part1);
	println!("{:?}", part2);

	Ok(())
}
