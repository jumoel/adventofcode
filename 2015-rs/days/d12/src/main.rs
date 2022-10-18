use std::fs;

use regex::Regex;
use serde_json::{Map, Value};

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn part1(input: &str) -> Result<i32> {
	let re = Regex::new(r"(-?\d+)")?;

	re.captures_iter(&input).fold(Ok(0), |acc, c| {
		match i32::from_str_radix(&c[1], 10) {
			Ok(n) => Ok(acc? + n),
			_ => acc,
		}
	})
}

fn has_red(obj: &Map<String, Value>) -> bool {
	obj.into_iter().any(|(_key, value)| match value {
		Value::String(s) => s == "red",
		_ => false,
	})
}

fn tally_json(json: &Value) -> i64 {
	let val = match json {
		Value::String(_) => 0,
		Value::Bool(_) => 0,
		Value::Null => 0,
		Value::Object(obj) => {
			if has_red(&obj) {
				0
			} else {
				obj.into_iter().map(|f| tally_json(f.1)).sum()
			}
		}
		Value::Number(n) => n.as_i64().expect("Invalid integer"),
		Value::Array(arr) => arr.iter().map(|a| tally_json(a)).sum(),
	};

	val
}

fn part2(input: &str) -> Result<i64> {
	let json: Value = serde_json::from_str(input)?;

	Ok(tally_json(&json))
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d12/input.txt")?;

	println!("{:?}", part1(&input)?);
	println!("{:?}", part2(&input)?);

	Ok(())
}
