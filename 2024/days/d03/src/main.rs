use std::fs;
use std::str::FromStr;

use nom::{
    branch::alt,
    bytes::complete::{tag, take},
    character::complete::digit1,
    combinator::{map, map_res},
    multi::many0,
    sequence::{delimited, separated_pair},
    IResult,
};

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

#[derive(Debug)]
enum Op {
    Garbage,
    Do,
    Dont,
    Mul(i32, i32),
}

fn parser(input: &str) -> IResult<&str, Vec<Op>> {
    many0(alt((parse_mul, parse_do, parse_dont, skip)))(input)
}

fn skip(s: &str) -> IResult<&str, Op> {
    map(take(1usize), |_| Op::Garbage)(s)
}

fn number(s: &str) -> IResult<&str, i32> {
    map_res(digit1, FromStr::from_str)(s)
}

fn parse_do(s: &str) -> IResult<&str, Op> {
    map(tag("do()"), |_| Op::Do)(s)
}

fn parse_dont(s: &str) -> IResult<&str, Op> {
    map(tag("don't()"), |_| Op::Dont)(s)
}

fn parse_mul(s: &str) -> IResult<&str, Op> {
    map(
        delimited(
            tag("mul("),
            separated_pair(number, tag(","), number),
            tag(")"),
        ),
        |(a, b)| Op::Mul(a, b),
    )(s)
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d03.txt")?;

    let instructions = parser(&input).unwrap().1;

    let part1 = instructions
        .iter()
        .filter_map(|x| match x {
            Op::Mul(a, b) => Some(a * b),
            _ => None,
        })
        .sum::<i32>();
    println!("Part 1: {:?}", part1);

    let part2 = instructions
        .iter()
        .fold((0, true), |(sum, enabled), op| match op {
            Op::Do => (sum, true),
            Op::Dont => (sum, false),
            Op::Mul(a, b) if enabled => (sum + a * b, enabled),
            _ => (sum, enabled),
        })
        .0;
    println!("Part 2: {:?}", part2);

    Ok(())
}
