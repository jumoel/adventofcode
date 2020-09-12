const { ASSERT, logIdent } = require("../util/test");
const { compose } = require("../util/fp");
const { split } = require("../util/string");
const { map, sum } = require("../util/array");
const { range } = require("../util/range");

const PATTERN = [0, 1, 0, -1];
function getBaseSignal(repeat) {
  ASSERT(repeat > 0, "Repeat must be greater than zero");

  return PATTERN.reduce((acc, elem) => {
    return acc.concat(new Array(repeat).fill(elem));
  }, []);
}

function applyFFT(line, index) {
  const baseSignal = getBaseSignal(index + 1);

  return compose(
    map((n, idx) => {
      return n * baseSignal[(idx + 1) % baseSignal.length];
    }),
    sum(0),
    compose(String, split(""), x => x.pop()),
  )(line);
}

function FFT(input, phases) {
  return range(0, phases).reduce((input, phaseNo) => {
    return compose(
      String,
      split(""),
      map(Number),
      map((_v, _i, arr) => [...arr]),
      map(applyFFT),
      x => x.join(""),
    )(input);
  }, input);
}

/* No idea what this does */
function FFT2(input, phases) {
  const inputList = input.split("").map(Number);
  for (let p = 0; p < phases; p++) {
    let partial_sum = inputList.reduce((a, b) => a + b, 0);
    for (let j = 0; j < inputList.length; j++) {
      let t = partial_sum;
      partial_sum -= inputList[j];

      inputList[j] = Math.abs(t) % 10;
    }
  }
  return inputList.join("");
}

function part1(input) {
  return FFT(input, 100).substring(0, 8);
}

function part2(input) {
  const offset = Number(input.substring(0, 7));
  const repeated = input.repeat(10000).substring(offset);

  const output = FFT2(repeated, 100);

  return output.substring(0, 8);
}

module.exports = {
  getBaseSignal,
  FFT,
  part2,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));
  console.log("PART 2:", part2(input));
}
