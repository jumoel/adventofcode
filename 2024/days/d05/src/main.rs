use std::{
    cmp::Ordering,
    collections::{HashMap, HashSet},
    fs,
};

use anyhow::{Context, Result};

type Instruction = HashSet<i32>;
type Instructions = HashMap<i32, Instruction>;

fn pages_valid(pages: &Vec<i32>, instructions: &Instructions) -> bool {
    pages.iter().enumerate().all(|(idx, p)| {
        pages.iter().skip(idx + 1).all(|nextpage| {
            let all_following = instructions
                .get(p)
                .map_or(true, |afters| afters.contains(nextpage));

            let not_before = instructions
                .get(nextpage)
                .map_or(true, |befores| !befores.contains(p));

            all_following && not_before
        })
    })
}

fn main() -> Result<()> {
    let input = fs::read_to_string("../input/2024/5/input.txt")?;

    let (instructions, pages) = input.split_once("\n\n").context("Invalid input")?;

    let instructions = instructions.trim().lines().try_fold(
        Instructions::new(),
        |mut map: Instructions, line: &str| -> Result<_> {
            let (page, after) = line.split_once("|").context("Invalid instruction")?;

            map.entry(page.parse().context("Invalid page")?)
                .or_insert_with(Instruction::new)
                .insert(after.parse().context("Invalid after")?);

            Ok(map)
        },
    )?;

    let pagelists: Vec<Vec<i32>> = pages
        .trim()
        .lines()
        .map(|l| l.split(",").map(|p| p.parse().unwrap()).collect())
        .collect();

    let part1: i32 = pagelists
        .iter()
        .filter_map(|pages| {
            if pages_valid(pages, &instructions) {
                Some(pages.get(pages.len() / 2).unwrap())
            } else {
                None
            }
        })
        .sum();

    let part2: i32 = pagelists
        .iter()
        .filter(|pages| !pages_valid(pages, &instructions))
        .map(|pages| {
            let mut sorted = pages.clone();
            sorted.sort_by(|a, b| {
                let a_before_b = instructions
                    .get(a)
                    .map_or(false, |afters| afters.contains(b));

                if a_before_b {
                    Ordering::Less
                } else {
                    Ordering::Greater
                }
            });

            let index = pages.len() / 2;

            pages.get(index).unwrap().clone()
        })
        .sum();

    println!("Part 1: {:?}", part1);
    println!("Part 2: {:?}", part2);

    Ok(())
}
