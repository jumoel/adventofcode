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

#[derive(Debug, Copy, Clone)]
struct Mul {
    a: i32,
    b: i32,
}

fn mul_or_skip(input: &str) -> IResult<&str, Vec<Option<Mul>>> {
    many0(alt((parse_mul, skip)))(input)
}

fn skip(s: &str) -> IResult<&str, Option<Mul>> {
    map(take(1usize), |_| None)(s)
}

fn number(s: &str) -> IResult<&str, i32> {
    map_res(digit1, FromStr::from_str)(s)
}

fn parse_mul(s: &str) -> IResult<&str, Option<Mul>> {
    map(
        delimited(
            tag("mul("),
            separated_pair(number, tag(","), number),
            tag(")"),
        ),
        |(a, b)| Some(Mul { a, b }),
    )(s)
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d03.txt")?;

    let res = mul_or_skip(&input)
        .unwrap()
        .1
        .iter()
        .filter_map(|x| *x)
        .map(|x| x.a * x.b)
        .sum::<i32>();
    println!("{:?}", res);

    Ok(())
}
