use itertools::EitherOrBoth::*;
use itertools::Itertools;
use std::fs;

fn vowel(c: char) -> i32 {
	match c {
		'a' | 'e' | 'i' | 'o' | 'u' => 1,
		_ => 0,
	}
}

fn nice1(input: &str) -> usize {
	let forbidden = vec!["ab", "cd", "pq", "xy"];
	let nice = input.lines().filter(|line| {
		if forbidden.iter().any(|f| line.contains(f)) {
			return false;
		}

		let (vowels, has_double) = line.chars().zip_longest(line.chars().skip(1)).fold(
			(0, false),
			|(vowels, has_double), vals| match vals {
				Both(first, second) => (vowels + vowel(first), has_double || first == second),
				Left(first) => (vowels + vowel(first), has_double),
				_ => (vowels, has_double),
			},
		);

		vowels > 2 && has_double
	});

	nice.count()
}

fn nice2(input: &str) -> usize {
	let nice = input.lines().filter(|line| {
		let chars = line.chars().collect::<Vec<char>>();
		let split_pair = chars.windows(3).any(|s| match s {
			[f, _, t] => f == t,
			_ => false,
		});

		let separated_pairs = chars.windows(2).enumerate().any(|(i, p)| {
			line.chars()
				.skip(i + 2)
				.collect::<Vec<char>>()
				.windows(2)
				.any(|p2| match p2 {
					[f, s] => *f == p[0] && *s == p[1],
					_ => false,
				})
		});

		split_pair && separated_pairs
	});

	nice.count()
}

fn main() {
	let input =
		fs::read_to_string("../input/2015/5/input.txt").expect("Something went wrong reading the file");

	println!("Part 1: {}", nice1(&input));

	println!("Part 2: {}", nice2(&input));
}
