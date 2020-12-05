use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn shift(seq: &str, init: i32, up: char, down: char) -> Result<i32> {
	let (val, _) =
		seq.chars().try_fold((0, init), |(min, max), c| {
			let dist = (max - min) / 2;

			if c == up {
				Ok((min + dist, max))
			} else if c == down {
				Ok((min, max - dist))
			} else {
				Err(format!("invalid shift char: {}", c))
			}
		})?;

	Ok(val)
}

fn process_pass(pass: &str) -> Result<i32> {
	assert_eq!(pass.len(), 10);

	let row = &pass[0..7];
	let seat = &pass[7..];

	let row = shift(row, 128, 'B', 'F')?;
	let seat = shift(seat, 8, 'R', 'L')?;

	Ok(row * 8 + seat)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d05/input.txt")?;

	let part1 = input
		.lines()
		.map(|line| process_pass(line).unwrap_or(0))
		.max()
		.unwrap_or(0);

	// let part2 = part2(&passports, &reqs)?;

	println!("{:?}", part1);
	// println!("{:?}", part2);

	Ok(())
}
