use itertools::EitherOrBoth::*;
use itertools::Itertools;
use std::fs;

fn vowel(c: char) -> i32 {
    match c {
        'a' | 'e' | 'i' | 'o' | 'u' => 1,
        _ => 0,
    }
}

fn main() {
    let input = fs::read_to_string("d05/input.txt").expect("Something went wrong reading the file");

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

    println!("Part 1: {}", nice.count());

    println!("Part 2: {}", 0);
}
