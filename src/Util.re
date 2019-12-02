let readFile = filename => Node.Fs.readFileSync(filename, `utf8);
let args = Node.Process.argv->Array.to_list->Belt.List.drop(2);

let readInputFile =
  switch (args) {
  | Some([file]) => readFile(file)
  | _ =>
    Js.log("Only 1 input file supported");
    Node.Process.exit(1);

    "";
  };
