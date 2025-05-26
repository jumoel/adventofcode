use regex::Regex;
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn parse1(min: usize, max: usize, req: char, pw: &str) -> i32 {
	let count = pw.matches(req).count();

	if count >= min && count <= max {
		1
	} else {
		0
	}
}

fn parse2(min: usize, max: usize, req: char, pw: &str) -> i32 {
	// The elves don't index like proper beings
	match (pw.chars().nth(min - 1), pw.chars().nth(max - 1)) {
		(Some(a), Some(b)) => {
			let a = req == a;
			let b = req == b;

			if (a || b) && !(a && b) {
				1
			} else {
				0
			}
		}
		_ => 0,
	}
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2020/2/input.txt")?;

	let mut lines = input.lines();

	let re = Regex::new(r"^(\d+)-(\d+) ([a-z0-9]): (.+)$").unwrap();

	let (part1, part2) = lines.try_fold(
		(0, 0),
		|(p1, p2), line| -> Result<(i32, i32)> {
			let cap = re.captures(line).unwrap();

			// 1 for the whole thing + 4 capture groups
			assert_eq!(cap.len(), 5);

			let min: usize = cap[1].parse()?;
			let max: usize = cap[2].parse()?;
			let req: char =
				cap[3].chars().nth(0).ok_or("invalid req")?;
			let pw: &str = &cap[4];

			Ok((
				p1 + parse1(min, max, req, pw),
				p2 + parse2(min, max, req, pw),
			))
		},
	)?;

	println!("{:?}", part1);
	println!("{:?}", part2);

	Ok(())
}
