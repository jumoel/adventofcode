let sum = list => List.fold_left(Int.add, 0, list);

let min = list => List.fold_left(min, max_int, list);
