use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(input: &str, preamble: usize) -> Result<i32> {
	let parts = input.lines().filter_map(|f| f.parse::<i32>().ok());

	Ok(0)
}

fn part2(input: String, preamble: usize) -> Result<i32> {
	Ok(0)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("d09/input.txt")?;
	let preamble = 5;

	println!("{:?}", part1(&input, preamble)?);
	println!("{:?}", part2(input, preamble)?);

	Ok(())
}
