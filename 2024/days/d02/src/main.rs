use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d02.txt")?;
    let inputs = input.lines().map(|l| {
        l.split_whitespace()
            .filter_map(|p| p.parse::<i32>().ok())
            .collect::<Vec<_>>()
    });

    let res1 = inputs
        .filter(|l| {
            l.windows(2)
                .try_fold(None, |prev_order, w| {
                    let (l, r) = (w[0], w[1]);
                    let diff = i32::abs(l - r);
                    let order = l.cmp(&r);

                    match (prev_order, diff) {
                        (None, 1 | 2 | 3) => Ok(Some(order)),
                        (Some(o), 1 | 2 | 3) if o == order => Ok(Some(order)),
                        _ => Err("Invalid order"),
                    }
                })
                .is_ok()
        })
        .count();

    println!("Part 1: {}", res1);

    Ok(())
}
