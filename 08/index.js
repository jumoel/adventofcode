const { chunk, matches, transpose } = require("../util/array");

const WIDTH = 25;
const HEIGHT = 6;

function part1(input) {
  const layers = chunk([...input], WIDTH * HEIGHT);

  const [, layer] = layers
    .map(c => matches(c, "0"))
    .map((v, i) => [v, i])
    .sort(([a], [b]) => a - b)
    .shift();

  const ones = matches(layers[layer], "1");
  const twos = matches(layers[layer], "2");

  return ones * twos;
}

function part2(input) {
  const layers = chunk([...input], WIDTH * HEIGHT);

  const image = transpose(layers).map(s => s.find(p => p !== "2"));

  return chunk(image, WIDTH)
    .map(s => s.join(""))
    .join("\n")
    .replace(/0/g, " ");
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));
  console.log("PART 2:");
  console.log(part2(input));
}
