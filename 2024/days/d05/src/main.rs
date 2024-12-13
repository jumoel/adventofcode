use std::{
    collections::{HashMap, HashSet},
    fs,
};

use anyhow::{Context, Result};

type Instruction = HashSet<i32>;
type Instructions = HashMap<i32, Instruction>;

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d05.txt")?;

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
            let valid = pages.iter().enumerate().all(|(idx, p)| {
                pages.iter().skip(idx + 1).all(|nextpage| {
                    let all_following = instructions
                        .get(p)
                        .map_or(true, |afters| afters.contains(nextpage));

                    let not_before = instructions
                        .get(nextpage)
                        .map_or(true, |befores| !befores.contains(p));

                    all_following && not_before
                })
            });

            if valid {
                Some(pages.get(pages.len() / 2).unwrap())
            } else {
                None
            }
        })
        .sum();

    println!("Part 1: {:?}", part1);

    Ok(())
}
