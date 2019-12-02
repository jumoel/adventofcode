let program =
  Util.readInputFile
  ->String.trim
  ->String.split_on_char(',', _)
  ->List.map(int_of_string, _);

exception InvalidOpcode(int);
exception InvalidProgram;

type op =
  | ADD(int, int, int, int)
  | MULT(int, int, int, int)
  | EXIT;

let get = List.nth;
let set = (mem, pos, value) =>
  List.mapi(
    (i, v) =>
      if (i == pos) {
        value;
      } else {
        v;
      },
    mem,
  );

let getVal = (mem, reg) => mem->get(reg)->get(mem, _);

let toOp = (mem, pc) =>
  switch (mem->get(pc)) {
  | 99 => EXIT
  | 1 => ADD(mem->getVal(pc + 1), mem->getVal(pc + 2), mem->get(pc + 3), 4)
  | 2 =>
    MULT(mem->getVal(pc + 1), mem->getVal(pc + 2), mem->get(pc + 3), 4)
  | n => raise(InvalidOpcode(n))
  };

let rec run = (memory, pc) => {
  switch (memory->toOp(pc)) {
  | EXIT => memory->get(0)
  | ADD(in1, in2, out, inc) => memory->set(out, in1 + in2)->run(pc + inc)
  | MULT(in1, in2, out, inc) => memory->set(out, in1 * in2)->run(pc + inc)
  };
};

let runWithArgs = (program, noun, verb) =>
  switch (program) {
  | [res, _, _, ...rest] => run([res, noun, verb, ...rest], 0)
  | _ => raise(InvalidProgram)
  };

// Part 1
//Js.log(runWithArgs(program, 12, 2));

// Part 2

let main = {
  let nouns = Belt.List.makeBy(100, i => i);
  let verbs = Belt.List.makeBy(100, i => i);

  let (noun, verb) =
    nouns
    |> List.map(noun => verbs |> List.map(verb => (noun, verb)))
    |> List.flatten
    |> List.find(((noun, verb)) =>
         runWithArgs(program, noun, verb) === 19690720
       );

  Js.log(noun * 100 + verb);
  ();
};
