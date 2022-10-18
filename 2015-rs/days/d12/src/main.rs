use serde_json::{Map, Value};
use std::fs;

type Result<T> =
	::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn has_red(obj: &Map<String, Value>) -> bool {
	obj.into_iter().any(|(_key, value)| match value {
		Value::String(s) => s == "red",
		_ => false,
	})
}

fn tally_json(json: &Value, omit_red: bool) -> i64 {
	let val = match json {
		Value::String(_) => 0,
		Value::Bool(_) => 0,
		Value::Null => 0,
		Value::Object(obj) => {
			if has_red(&obj) && omit_red {
				0
			} else {
				obj.into_iter()
					.map(|f| tally_json(f.1, omit_red))
					.sum()
			}
		}
		Value::Number(n) => n.as_i64().expect("Invalid integer"),
		Value::Array(arr) => {
			arr.iter().map(|a| tally_json(a, omit_red)).sum()
		}
	};

	val
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d12/input.txt")?;
	let json: Value = serde_json::from_str(&input)?;

	println!("{:?}", tally_json(&json, false));
	println!("{:?}", tally_json(&json, true));

	Ok(())
}
