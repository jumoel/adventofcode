use std::{fs, ops::Index};

use anyhow::{anyhow, Context, Result};

const WALL: char = '#';
const VISITED: char = 'X';

type Map = Vec<Vec<char>>;

enum Dir {
    Up,
    Down,
    Left,
    Right,
}

fn coord(x: i32, y: i32, dir: &Dir) -> (i32, i32) {
    match dir {
        Dir::Up => (x, y - 1),
        Dir::Down => (x, y + 1),
        Dir::Left => (x - 1, y),
        Dir::Right => (x + 1, y),
    }
}

fn get(map: &Map, x: i32, y: i32) -> Option<char> {
    let row = map.get(y as usize)?;
    row.get(x as usize).copied()
}

fn visit(mut map: Map, x: i32, y: i32) -> Result<Map> {
    if y >= 0 && y < map.len() as i32 && x >= 0 && x < map[y as usize].len() as i32 {
        map[y as usize][x as usize] = VISITED;
        Ok(map)
    } else {
        Err(anyhow!("Out of bounds"))
    }
}

#[allow(dead_code)]
fn print_map(map: &Map) {
    println!(
        "---\n{}",
        map.iter()
            .map(|row| row.iter().collect::<String>())
            .collect::<Vec<_>>()
            .join("\n")
    );
}

fn part1(map: &Map) -> Result<usize> {
    let mut map = map.clone();
    let width = map[0].len() as i32;
    let height = map.len() as i32;

    let (mut x, mut y, mut dir) = map
        .iter()
        .enumerate()
        .find_map(|(y, row)| {
            row.iter().enumerate().find_map(|(x, c)| match c {
                '^' => Some((x as i32, y as i32, Dir::Up)),
                'v' => Some((x as i32, y as i32, Dir::Down)),
                '<' => Some((x as i32, y as i32, Dir::Left)),
                '>' => Some((x as i32, y as i32, Dir::Right)),
                _ => None,
            })
        })
        .context("No starting point found")?;

    while x < width && x >= 0 && y < height && y >= 0 {
        // print_map(&map);

        let (xn, yn) = coord(x, y, &dir);
        let next = get(&map, xn, yn);

        if let Some(c) = next {
            if c == WALL {
                dir = match dir {
                    Dir::Up => Dir::Right,
                    Dir::Down => Dir::Left,
                    Dir::Left => Dir::Up,
                    Dir::Right => Dir::Down,
                }
            }
        }

        map = visit(map, x, y)?;
        (x, y) = coord(x, y, &dir);
    }
    // print_map(&map);

    let count = map.iter().flatten().filter(|c| **c == VISITED).count();

    Ok(count)
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d06.txt")?;

    let map: Map = input.lines().map(|l| l.chars().collect()).collect();

    println!("Part 1: {}", part1(&map)?);

    Ok(())
}
