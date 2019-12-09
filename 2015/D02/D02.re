let part1 = input =>
  input
  |> List.map(((l, w, h)) => {
       let sizes = [l * w, w * h, h * l];

       2
       * List.fold_left(Util.Int.add, 0, sizes)
       + List.fold_left(min, max_int, sizes);
     })
  |> List.fold_left(Util.Int.add, 0);

let part2 = input =>
  input
  |> List.map(((l, w, h)) => {
       let shortest =
         [l, w, h] |> List.sort(Int.compare) |> Core.List.take(_, 2);
       2 * List.fold_left(Util.Int.add, 0, shortest) + l * w * h;
     })
  |> List.fold_left(Util.Int.add, 0);

let () = {
  let input =
    Util.IO.getInput()
    |> Core.String.split_lines
    |> List.map(line =>
         line
         |> Core.String.split(~on='x')
         |> Core.List.map(~f=Core.int_of_string)
       )
    |> List.map(dims =>
         switch (dims) {
         | [l, w, h] => (l, w, h)
         | _ => raise(Failure("Invalid dimensions"))
         }
       );

  Console.log("PART 1:");
  Console.log(part1(input));

  Console.log("PART 2:");
  Console.log(part2(input));

  ();
};
