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

const XMAS: [char; 4] = ['X', 'M', 'A', 'S'];
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

fn get(x: i32, y: i32, crossword: &Vec<Vec<char>>) -> Result<&char> {
    let row = crossword.get(y as usize).context("Out of bounds")?;
    row.get(x as usize).context("Out of bounds")
}

fn check_xmas(crossword: &Vec<Vec<char>>, x: usize, y: usize, dir: &Dir) -> bool {
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

    XMAS.iter()
        .enumerate()
        .map(|(i, c)| -> Result<bool> {
            let ni: i32 = i.try_into()?;

            let mut nx: i32 = x.try_into()?;
            nx += ni * dx;

            let mut ny: i32 = y.try_into()?;
            ny += ni * dy;

            let cell = get(nx, ny, crossword)?;

            Ok(*cell == *c)
        })
        .all(|x: Result<bool, _>| match x {
            Ok(true) => true,
            _ => false,
        })
}

fn part1(crossword: &Vec<Vec<char>>) -> usize {
    crossword.iter().enumerate().fold(0, |mut sum, (y, row)| {
        sum += row.iter().enumerate().fold(0, |mut sum, (x, c)| {
            if *c != XMAS[0] {
                return sum;
            }

            sum += DIRS
                .iter()
                .filter(|dir| check_xmas(&crossword, x, y, dir))
                .count();

            sum
        });

        sum
    })
}

type Point = (i32, i32);
type Line = (Point, Point);
const XDIRS: [Line; 2] = [((-1, -1), (1, 1)), ((-1, 1), (1, -1))];

fn part2(cw: &Vec<Vec<char>>) -> usize {
    cw.iter().enumerate().fold(0, |mut sum, (y, row)| {
        sum += row.iter().enumerate().fold(0, |mut sum, (x, c)| {
            if *c != 'A' {
                return sum;
            }

            let is_cross = XDIRS
                .iter()
                .map(|((x1, y1), (x2, y2))| -> Result<bool> {
                    let nx: i32 = x.try_into()?;
                    let ny: i32 = y.try_into()?;

                    let (nx1, ny1, nx2, ny2) = (nx + x1, ny + y1, nx + x2, ny + y2);
                    let (c1, c2) = (get(nx1, ny1, cw), get(nx2, ny2, cw));

                    match (c1, c2) {
                        (Ok('S'), Ok('M')) | (Ok('M'), Ok('S')) => Ok(true),
                        _ => Ok(false),
                    }
                })
                .all(|x| matches!(x, Ok(true)));

            if is_cross {
                sum += 1;
            }

            sum
        });

        sum
    })
}

fn main() -> Result<()> {
    let input = fs::read_to_string("../input/2024/4/input.txt")?;

    let crossword = input
        .lines()
        .map(|l| l.chars().collect())
        .collect::<Vec<Vec<char>>>();

    println!("Part 1: {:?}", part1(&crossword));
    println!("Part 2: {:?}", part2(&crossword));

    Ok(())
}
