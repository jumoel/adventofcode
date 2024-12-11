use std::collections::HashMap;
use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn freq_map(list: Vec<i32>) -> HashMap<i32, i32> {
    list.iter().fold(HashMap::new(), |mut acc, &e| {
        *acc.entry(e).or_insert(0) += 1;
        acc
    })
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d01.txt")?;

    let (mut left, mut right): (Vec<i32>, Vec<i32>) = input
        .lines()
        .map(|e| {
            let parts = e.split_whitespace().collect::<Vec<&str>>();

            (
                parts[0].parse::<i32>().unwrap(),
                parts[1].parse::<i32>().unwrap(),
            )
        })
        .unzip();

    left.sort();
    right.sort();

    let res1 = left
        .iter()
        .zip(right.iter())
        .map(|(l, r)| i32::abs(l - r))
        .sum::<i32>();

    println!("Part 1: {}", res1);

    let (lfreq, rfreq) = (freq_map(left), freq_map(right));

    let res2 = lfreq
        .iter()
        .map(|(k, v)| v * k * rfreq.get(&k).unwrap_or(&0))
        .sum::<i32>();

    println!("Part 2: {}", res2);

    Ok(())
}
