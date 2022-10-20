use std::fs;

fn hash(s: &str, suffix: i32) -> String {
	format!("{:x}", md5::compute(format!("{}{}", s, suffix.to_string())))
}

fn main() {
	let input =
		fs::read_to_string("days/d04/input.txt").expect("Something went wrong reading the file");

	let mut suffix: i32 = 0;
	let mut result = hash(&input, suffix);

	while !result.starts_with("00000") {
		suffix += 1;
		result = hash(&input, suffix);
	}

	println!("Part 1: {}", suffix);

	while !result.starts_with("000000") {
		suffix += 1;
		result = hash(&input, suffix);
	}

	println!("Part 2: {}", suffix);
}
