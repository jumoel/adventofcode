use itertools::Itertools;
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn nextchar(c: char) -> char {
	match c {
		'z' => 'a', // handles overflow
		'h' => 'j', // skip i, because it's invalid
		'k' => 'm', // skip l, because it's invalid
		'n' => 'p', // skip o, because it's invalid
		_ => (c as u8 + 1) as char,
	}
}

fn incrementpw(pw: &str) -> Result<String> {
	let res = pw.chars().rev().fold(
		(true, Vec::new()),
		|(carry, mut acc), c| {
			let next = if carry { nextchar(c) } else { c };

			// Inserting at '0' reverses the string to the proper order again
			acc.insert(0, next as u8);

			(next == 'a' && c == 'z', acc)
		},
	);

	Ok(String::from(std::str::from_utf8(res.1.as_slice())?))
}

fn increasing(candidate: &str) -> bool {
	candidate
		.chars()
		.tuple_windows::<(_, _, _)>()
		.find(|(a, b, c)| {
			*a as u8 == *b as u8 - 1 && *a as u8 == *c as u8 - 2
		})
		.is_some()
}

fn haspairs(candidate: &str) -> bool {
	let res = candidate
		.chars()
		.enumerate()
		.tuple_windows::<(_, _)>()
		.filter_map(|(a, b)| -> Option<usize> {
			if a.1 == b.1 {
				Some(a.0)
			} else {
				None
			}
		})
		// Count pairs and keep track of their last starting index
		.fold((0, None), |acc, i| match acc {
			// This will hit in the first iteration
			(_, None) => (1, Some(i)),
			// If there is a gap of at least 1 between starting indices, the pairs are not overlapping
			(count, Some(prev)) if i > prev + 1 => {
				(count + 1, Some(i))
			}
			_ => acc,
		});

	res.0 >= 2
}

fn nextpw(pw: &str) -> Result<String> {
	let mut candidate = pw.to_string();

	loop {
		candidate = incrementpw(&candidate)?;

		if increasing(&candidate) && haspairs(&candidate) {
			break;
		}
	}

	Ok(candidate)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d11/input.txt")?;

	let part1 = nextpw(&input.trim())?;
	println!("Part 1: {}", part1);
	println!("Part 2: {}", nextpw(&part1)?);

	Ok(())
}
