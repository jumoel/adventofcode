let elevator = char =>
  switch (char) {
  | '(' => 1
  | ')' => (-1)
  | _ => 0
  };

let () = {
  let input = Util.IO.getInput();

  let part1 =
    input
    |> String.to_seq
    |> Seq.fold_left((res, char) => res + elevator(char), 0);

  let part2 = {
    let rec findBasement = (acc, ss) => {
      switch (ss) {
      | [(index, char), ...rest] =>
        if (acc + elevator(char) == (-1)) {
          index + 1;
        } else {
          findBasement(acc + elevator(char), rest);
        }
      | [] => (-1)
      };
    };

    findBasement(0, input |> String.to_seqi |> List.of_seq);
  };

  Console.log("PART 1: " ++ string_of_int(part1));

  Console.log("PART 2: " ++ string_of_int(part2));

  ();
};
