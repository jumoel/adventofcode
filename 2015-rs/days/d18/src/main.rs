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

const STEPS: usize = 100;

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

fn next_world(world: &World, next_char: &dyn Fn(char, i32, usize, usize) -> char) -> World {
	let mut clone = world.clone();
	let sy = clone.len();
	let sx = clone[0].len();

	for y in 0..sy {
		for x in 0..sx {
			clone[y][x] = next_char(clone[y][x], neighbors_on(&world, x as i32, y as i32), x, y);
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

fn part1(world: &World) -> i32 {
	let mut world1 = world.clone();
	let next_char1 = |light: char, neighbors: i32, _x: usize, _y: usize| -> char {
		match (light, neighbors) {
			(LIGHT, 2) => LIGHT,
			(_, 3) => LIGHT,
			_ => OFF,
		}
	};

	for _ in 0..STEPS {
		world1 = next_world(&world1, &next_char1);
	}

	lights_on(&world1)
}

fn part2(world: &World) -> i32 {
	let y_max = world.len() - 1;
	let x_max = world[0].len() - 1;

	let mut world2 = world.clone();
	world2[0][0] = LIGHT;
	world2[0][x_max] = LIGHT;
	world2[y_max][0] = LIGHT;
	world2[y_max][x_max] = LIGHT;

	let next_char2 =
		|light: char, neighbors: i32, x: usize, y: usize| match (light, neighbors, x, y) {
			(_, _, x, y) if x == 0 && y == 0 => LIGHT,
			(_, _, x, y) if x == 0 && y == y_max => LIGHT,
			(_, _, x, y) if x == x_max && y == 0 => LIGHT,
			(_, _, x, y) if x == x_max && y == y_max => LIGHT,
			(LIGHT, 2, _, _) => LIGHT,
			(_, 3, _, _) => LIGHT,
			_ => OFF,
		};

	for _ in 0..STEPS {
		world2 = next_world(&world2, &next_char2);
	}

	lights_on(&world2)
}

fn main() -> Result<()> {
	let input = fs::read_to_string("days/d18/input.txt")?;

	let world: World = input
		.trim()
		.lines()
		.map(|line| line.chars().collect())
		.collect();

	println!("Part 1: {}", part1(&world));
	println!("Part 2: {}", part2(&world));

	Ok(())
}
