use std::collections::HashMap;
use std::fs;

fn santa(cs: &mut dyn Iterator<Item = char>, visited: &mut HashMap<(i32, i32), i32>) -> () {
    cs.fold((0, 0), |(x, y), dir| {
        let count = visited.entry((x, y)).or_insert(0);

        *count += 1;

        match dir {
            '^' => (x, y + 1),
            'v' => (x, y - 1),
            '<' => (x - 1, y),
            '>' => (x + 1, y),
            _ => (x, y),
        }
    });
}

fn main() {
    let input = fs::read_to_string("d03/input.txt").expect("Something went wrong reading the file");

    let mut visited1 = HashMap::new();

    santa(&mut input.chars(), &mut visited1);

    println!("Part 1: {}", visited1.len());

    let mut visited2 = HashMap::new();

    santa(&mut input.chars().step_by(2), &mut visited2);
    santa(&mut input.chars().skip(1).step_by(2), &mut visited2);

    println!("Part 2: {}", visited2.len());
}
