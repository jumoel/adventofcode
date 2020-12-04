use std::collections::HashSet;
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn validate1(passport: &&str) -> bool {
	let parts: HashSet<&str> = passport
		.split_ascii_whitespace()
		.map(|part| part.split(":").nth(0).unwrap())
		.collect();

	let required =
		vec!["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];

	required.iter().all(|field| parts.contains(field))
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d04/input.txt")?;

	let passports = input.split("\n\n");

	let part1 = passports.filter(validate1).count();

	println!("{:?}", part1);

	Ok(())
}
