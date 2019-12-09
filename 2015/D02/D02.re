let part1 = input =>
  input
  |> List.map(((l, w, h)) => {
       let sizes = [l * w, w * h, h * l];

       2 * Util.IntList.sum(sizes) + Util.IntList.min(sizes);
     })
  |> Util.IntList.sum;

let part2 = input =>
  input
  |> List.map(((l, w, h)) => {
       let shortest =
         [l, w, h] |> List.sort(Int.compare) |> Core.List.take(_, 2);

       2 * Util.IntList.sum(shortest) + l * w * h;
     })
  |> Util.IntList.sum;

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
