use std::fs;

type Result<T> = ::std::result::Result<T, Box<dyn ::std::error::Error>>;

fn safe(l: Vec<i32>) -> bool {
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
}

fn main() -> Result<()> {
    let input = fs::read_to_string("inputs/d02.txt")?;
    let inputs = input.lines().map(|l| {
        l.split_whitespace()
            .filter_map(|p| p.parse::<i32>().ok())
            .collect::<Vec<_>>()
    });

    let res1 = inputs.clone().filter(|l| safe(l.clone())).count();
    let res2 = inputs
        .clone()
        .filter(|l| {
            let is_safe = safe(l.clone());

            if is_safe {
                true
            } else {
                for i in 0..l.len() {
                    let mut new = l.clone();
                    new.remove(i);

                    if safe(new) {
                        return true;
                    }
                }

                false
            }
        })
        .count();

    println!("Part 1: {}", res1);
    println!("Part 2: {}", res2);

    Ok(())
}
