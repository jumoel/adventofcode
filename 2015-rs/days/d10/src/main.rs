use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn lookandsay(input: String) -> String {
	let mut iter = input.trim().chars();

	let mut result = String::from("");
	let mut same = 0;

	while let Some(needle) = iter.nth(same) {
		same = iter.clone().take_while(|c| c.eq(&needle)).count();
		result.push_str(&format!("{}{}", same + 1, needle));
	}

	result
}

fn repeat(input: &String, count: usize) -> usize {
	let mut result = String::from(input);

	for _ in 0..count {
		result = lookandsay(result)
	}

	result.len()
}

fn main() -> Result<()> {
	let input = fs::read_to_string("../input/2015/10/input.txt")?;

	println!("Part 1: {}", repeat(&input, 40));
	println!("Part 2: {}", repeat(&input, 50));

	Ok(())
}
