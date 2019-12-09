import { permutations, last } from "../util/array";

import { run, make } from "./vm";

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = readInput(__dirname, "input.txt")
    .trim()
    .split(",")
    .map(Number);

  const vm1 = run(make({ program, inputs: [1] }));
  console.log("PART 1:", vm1.outputs);

  const vm2 = run(make({ program, inputs: [2] }));
  console.log("PART 2:", vm2.outputs);
}
