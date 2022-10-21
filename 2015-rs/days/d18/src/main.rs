use std::fs;

use itertools::Itertools;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;
type World = Vec<Vec<char>>;

const NEIGHBORS: [(i32, i32); 8] = [
	(-1, 1),
	(-1, 0),
	(-1, -1),
	(0, 1),
	(0, -1),
	(1, 1),
	(1, 0),
	(1, -1),
];

const LIGHT: char = '#';
const OFF: char = '.';

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d18/input.txt")?;

	let world: World = input.lines().map(|line| line.chars().collect()).collect();

	fn neighbors_on(world: &World, x: i32, y: i32) -> i32 {
		let on = NEIGHBORS
			.iter()
			.filter_map(|(dx, dy)| -> Option<()> {
				world
					.get((y + dy) as usize)?
					.get((x + dx) as usize)?
					.eq(&LIGHT)
					.then_some(())
			})
			.count();

		on as i32
	}

	fn next_world(world: &World) -> World {
		let mut clone = world.clone();
		let sy = clone.len();
		let sx = clone[0].len();

		for y in 0..sy {
			for x in 0..sx {
				let val = match (clone[y][x], neighbors_on(&world, x as i32, y as i32)) {
					(LIGHT, 2) => LIGHT,
					(LIGHT, 3) => LIGHT,
					(OFF, 3) => LIGHT,
					_ => OFF,
				};

				clone[y][x] = val;
			}
		}

		clone
	}

	fn print_world(world: &World) {
		print!(
			"{}\n\n",
			world.iter().map(|line| line.iter().join("")).join("\n")
		)
	}

	fn lights_on(world: &World) -> i32 {
		world
			.iter()
			.flat_map(|f| f.iter().map(|c| if c == &LIGHT { 1 } else { 0 }))
			.sum()
	}

	let steps = 100;

	let mut world = world.clone();
	for _ in 0..steps {
		world = next_world(&world);
	}

	// print_world(&world);

	println!("Part 1: {}", lights_on(&world));

	Ok(())
}
