use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d10/input.txt")?;

	println!("input: {}", input);

	let mut iter = input.trim().chars();

	let mut lookandsay = String::from("");
	let mut nth = 0;

	while let Some(needle) = iter.nth(nth) {
		let same = iter.clone().take_while(|c| c.eq(&needle)).count();
		lookandsay.push_str(&format!("{}{}", same + 1, needle));
		nth = same;
	}

	println!("{}", lookandsay);

	Ok(())
}
