const { compose } = require("../util/fp");
const { map } = require("../util/array");
const { toLines, toChars } = require("../util/string");
const { clone } = require("../util/obj");
const { imageToStr } = require("../util/image");

function makeGame(input) {
  return compose(toLines, map(toChars), map(map(x => x === "#")))(input);
}

function neighbors(game, x, y) {
  return [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ].reduce((acc, [dx, dy]) => {
    const nx = dx + x;
    const ny = dy + y;

    if (nx < 0 || ny < 0 || ny >= game.length || nx >= game[0].length) {
      return acc;
    }

    return game[ny][nx] ? acc + 1 : acc;
  }, 0);
}

function tick(game) {
  const next = clone(game);

  for (let y = 0; y < game.length; y++) {
    for (let x = 0; x < game[y].length; x++) {
      const ns = neighbors(game, x, y);

      const shouldLive = game[y][x] && ns === 1;
      const shouldBeBorn = !game[y][x] && (ns === 1 || ns === 2);

      next[y][x] = shouldLive || shouldBeBorn;
    }
  }

  return next;
}

function p(game) {
  return imageToStr(game, { true: "#", false: "." });
}

function bio(game) {
  return game.flat(1).reduce((acc, val, idx) => {
    if (!val) {
      return acc;
    }

    return acc + Math.pow(2, idx);
  }, 0);
}

function part1(input) {
  let game = makeGame(input);

  const seen = new Set();

  while (true) {
    const str = p(game);

    if (seen.has(str)) {
      return bio(game);
    }
    seen.add(str);

    game = tick(game);
  }
}

function tick2(game) {
  const minlvl = Math.min(...Object.keys(game)) - 1;
  const maxlvl = Math.max(...Object.keys(game)) + 1;
}

function part2(input) {
  let game = { 0: makeGame(input) };

  let tick = 0;
  while (tick < 10) {
    game = tick2(game);
  }

  console.log(game);
}

module.exports = {
  makeGame,
  neighbors,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "test.txt");

  const p1 = part1(input);
  const p2 = part2(input);

  console.log("PART 1:", p1);
  console.log("PART 2:", p2);
}
