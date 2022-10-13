use std::fs;

fn main() {
	let map = fs::read_to_string("d01/input.txt")
		.expect("Something went wrong reading the file");

	let part1 = map.chars().fold(0, |acc, c| match c {
		'(' => acc + 1,
		')' => acc - 1,
		_ => acc,
	});

	println!("Part 1: {}", part1);

	let part2_partial: Result<i32, usize> =
		map.chars().enumerate().try_fold(0, |acc, (i, c)| {
			if acc == -1 {
				return Err(i);
			}

			let val = match c {
				'(' => (acc + 1),
				')' => (acc - 1),
				_ => (acc),
			};

			Ok(val)
		});

	let part2 = match part2_partial {
		Ok(_) => map.chars().count(),
		Err(c) => c,
	};

	println!("Part 2: {}", part2);
}
