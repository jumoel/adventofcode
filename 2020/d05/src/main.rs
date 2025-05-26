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

fn find_ids(
	input: &str,
) -> impl std::iter::Iterator<Item = i32> + '_ {
	input.lines().map(|line| process_pass(line).unwrap_or(0))
}

fn part1(input: &str) -> i32 {
	find_ids(input).max().unwrap_or(0)
}

fn part2(input: &str) -> i32 {
	let mut ids: Vec<i32> = find_ids(input).collect();

	ids.sort();

	let pairs: Vec<(usize, &i32)> = ids.iter().enumerate().collect();

	*pairs
		.iter()
		.skip(1)
		.find(|(pos, e)| {
			let prev = pairs.get(*pos - 1).unwrap();
			let prev_val = **e - 1;

			*prev.1 != prev_val
		})
		.unwrap_or(&(0, &0))
		.1 - 1
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2020/5/input.txt")?;

	println!("{:?}", part1(&input));
	println!("{:?}", part2(&input));

	Ok(())
}
