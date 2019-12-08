const {
  arrayPad,
  chunk,
  matches,
  permutations,
  transpose,
} = require("../util/array");
const { intCombine, intSplit } = require("../util/int");
const { range } = require("../util/range");
const { readInput } = require("../util/readInput");
const { intersection, union } = require("../util/set");
const { ASSERT, DEBUG } = require("../util/test");

function part1(input) {
  return input;
}

function part2(input) {
  return input;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));
  // console.log("PART 2:", part2(input));
}
