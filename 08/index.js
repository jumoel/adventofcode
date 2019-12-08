const { chunk, matches } = require("../util/array");

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

  const image = [];

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      image.push(getPixelData(layers, x, y));
    }
  }

  return chunk(image, WIDTH)
    .map(s => s.join(""))
    .join("\n")
    .replace(/0/g, " ");
}

function getPixelData(layers, x, y) {
  const TRANSPARENT = "2";

  for (let l = 0; l < layers.length; l++) {
    const found = layers[l][WIDTH * y + x];
    if (found !== TRANSPARENT) {
      return found;
    }
  }

  return TRANSPARENT;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));
  console.log("PART 2:");
  console.log(part2(input));
}
