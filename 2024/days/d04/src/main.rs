use std::fs;

use anyhow::{Context, Result};

#[derive(Debug)]
enum Dir {
    N,
    S,
    E,
    W,
    NE,
    NW,
    SE,
    SW,
}

const TARGET: [char; 4] = ['X', 'M', 'A', 'S'];
const DIRS: [Dir; 8] = [
    Dir::N,
    Dir::S,
    Dir::E,
    Dir::W,
    Dir::NE,
    Dir::NW,
    Dir::SE,
    Dir::SW,
];

fn check_word(crossword: &Vec<Vec<char>>, x: usize, y: usize, dir: &Dir) -> bool {
    let dx: i32 = match dir {
        Dir::N | Dir::S => 0,
        Dir::E | Dir::SE | Dir::NE => 1,
        Dir::W | Dir::SW | Dir::NW => -1,
    };

    let dy: i32 = match dir {
        Dir::E | Dir::W => 0,
        Dir::S | Dir::SE | Dir::SW => 1,
        Dir::N | Dir::NE | Dir::NW => -1,
    };

    TARGET
        .iter()
        .enumerate()
        .map(|(i, c)| -> Result<bool> {
            let ni: i32 = i.try_into()?;

            let mut nx: i32 = x.try_into()?;
            nx += ni * dx;

            let mut ny: i32 = y.try_into()?;
            ny += ni * dy;

            let row = crossword.get(ny as usize).context("Out of bounds")?;
            let cell = row.get(nx as usize).context("Out of bounds")?;

            Ok(*cell == *c)
        })
        .all(|x: Result<bool, _>| match x {
            Ok(true) => true,
            _ => false,
        })
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d04.txt")?;

    let crossword = input
        .lines()
        .map(|l| l.chars().collect())
        .collect::<Vec<Vec<char>>>();

    let part1 = crossword.iter().enumerate().fold(0, |mut sum, (y, row)| {
        sum += row.iter().enumerate().fold(0, |mut sum, (x, c)| {
            if *c != TARGET[0] {
                return sum;
            }

            sum += DIRS
                .iter()
                .filter(|dir| check_word(&crossword, x, y, dir))
                .count();

            sum
        });

        sum
    });

    println!("Part 1: {:?}", part1);

    Ok(())
}
