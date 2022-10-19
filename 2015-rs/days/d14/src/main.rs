use std::{collections::HashMap, fs};

type Error = Box<dyn ::std::error::Error>;
type Result<T> = ::std::result::Result<T, Error>;

type Speed = (i32, i32, i32);

fn distance_after(
	seconds: i32,
	(speed, time, rest): Speed,
) -> Result<i32> {
	let full_rounds = seconds / (time + rest);
	let remaining = i32::min(time, seconds % (time + rest));
	let dist = speed * (full_rounds * time + remaining);

	Ok(dist)
}

fn part1(speeds: &HashMap<String, Speed>) -> i32 {
	let seconds = 2503;
	speeds
		.iter()
		.filter_map(|(_, speed)| distance_after(seconds, *speed).ok())
		.max()
		.expect("part1 failed")
}

fn winner_after(
	speeds: &HashMap<String, Speed>,
	seconds: i32,
) -> Vec<String> {
	let distances = speeds
		.iter()
		.map(|(name, speed)| {
			(
				name.to_string(),
				distance_after(seconds, *speed).unwrap_or(0),
			)
		})
		.collect::<Vec<_>>();

	let winner_distance = distances
		.iter()
		.max_by_key(|s| s.1)
		.expect("Finding a winning distance failed")
		.1;

	let winners = distances.iter().filter_map(|(name, dist)| {
		if *dist == winner_distance {
			Some(name.to_string())
		} else {
			None
		}
	});

	winners.collect::<Vec<_>>()
}

fn part2(speeds: &HashMap<String, Speed>) -> i32 {
	let seconds = 2503;
	let mut tally = HashMap::new();

	for second in 1..=seconds {
		let winners = winner_after(speeds, second);

		for winner in winners {
			let points: i32 = tally.get(&winner).unwrap_or(&0) + 1;

			tally.insert(winner, points);
		}
	}

	tally
		.iter()
		.map(|(_, points)| points.clone())
		.max()
		.unwrap_or(0)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d14/input.txt")?;

	let speeds = input
		.lines()
		.map(|line| -> Result<_> {
			let line = line
				.replace("can fly ", "")
				.replace(", but then must rest for ", "")
				.replace("seconds", "")
				.replace("km/s for ", "")
				.replace(".", "");

			match line.split(" ").collect::<Vec<_>>().as_slice() {
				[name, speed, time, rest, _] => Ok((
					name.to_string(),
					(
						i32::from_str_radix(speed, 10)?,
						i32::from_str_radix(time, 10)?,
						i32::from_str_radix(rest, 10)?,
					),
				)),
				_ => panic!("Invalid format"),
			}
		})
		.collect::<Result<HashMap<_, _>>>()?;

	println!("Part 1: {}", part1(&speeds));
	println!("Part 2: {}", part2(&speeds));

	Ok(())
}
