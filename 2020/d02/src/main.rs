use regex::Regex;
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("d02/input.txt")?;

	let mut lines = input.lines();

	let re = Regex::new(r"^(\d+)-(\d+) (.): (.+)$").unwrap();

	let part1 = lines.try_fold(0, |acc, line| -> Result<i32> {
		let cap = re.captures(line).unwrap();

		if cap.len() < 5 {
			panic!("Invalid data");
		}

		let min: i32 = cap[1].parse()?;
		let max: i32 = cap[2].parse()?;
		let req: &str = &cap[3];
		let pw: &str = &cap[4];

		let count: i32 = pw.matches(req).count() as i32;

		if count >= min && count <= max {
			Ok(acc + 1)
		} else {
			Ok(acc)
		}
	})?;

	// let part1: i32 = part1(&entries)?;
	// let part2: i32 = part2(&entries)?;

	println!("{:?}", part1);
	// println!("{:?}", part2);

	Ok(())
}
