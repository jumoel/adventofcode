const { neighbors, makeGame } = require("./index");

const { readInput } = require("../util/readInput");
const input = readInput(__dirname, "test.txt");
const game = makeGame(input);

test.each([
  [0, 0, 1],
  [1, 0, 1],
  [2, 0, 1],
  [3, 0, 2],
  [4, 0, 1],

  [0, 1, 1],
  [1, 1, 2],
  [2, 1, 2],
  [3, 1, 3],
  [4, 1, 4],

  [0, 2, 1],
  [1, 2, 3],
  [2, 2, 3],
  [3, 2, 3],
  [4, 2, 2],

  [0, 3, 2],
  [1, 3, 3],
  [2, 3, 1],
  [3, 3, 3],
  [4, 3, 2],

  [0, 4, 0],
  [1, 4, 2],
  [2, 4, 1],
  [3, 4, 1],
  [4, 4, 0],
])("neighbors %d %d", (x, y, ns) => {
  expect(neighbors(game, x, y)).toEqual(ns);
});
