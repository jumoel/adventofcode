const { trim, toLines, toChars } = require("../util/string");
const { flatten, map, filter, reduce } = require("../util/array");
const { compose } = require("../util/fp");
const { logIdent } = require("../util/test");

function distance([ax, ay], [bx, by]) {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function visiblesFrom(point, asteroids) {
  const [px, py] = point;
  const sorted = compose(
    clone,
    filter(([x, y]) => x !== px || y !== py),
    map(coord => ({ coord, dist: distance(point, coord) })),
    x => x.sort((a, b) => a.dist - b.dist),
    map(({ coord }) => coord),
    map(coord => {
      const [x, y] = coord;
      return { coord, tan: Math.atan2(py - y, px - x) };
    }),
    reduce((acc, { coord, tan }) => {
      if (acc.hasOwnProperty(tan)) {
        return acc;
      }

      acc[tan] = coord;

      return acc;
    }, {}),
  )(asteroids);

  return sorted;
}

function findVisibles(input) {
  return compose(
    trim,
    toLines,
    map(trim),
    map(toChars),
    map((line, y) =>
      line
        .map((val, x) => ({ coords: [x, y], val, asteroid: val === "#" }))
        .filter(({ asteroid }) => asteroid)
        .map(({ coords }) => coords),
    ),
    flatten,
    map((coord, _, arr) => {
      const visibles = visiblesFrom(coord, arr);
      return {
        coord,
        list: visibles,
        visibles: Object.keys(visibles).length,
      };
    }),
  )(input);
}

function findWithMost(input) {
  const visibles = findVisibles(input).sort((a, b) => b.visibles - a.visibles);
  return visibles.shift();
}

function part1(input) {
  return findWithMost(input).visibles;
}

function tan2deg(tan) {
  return (tan * 180) / Math.PI;
}

function part2(input) {
  const { list, coord } = findWithMost(input);
  const [x, y] = coord;

  const sorted = compose(
    Object.entries,
    map(([tan, [x, y]]) => {
      return {
        // Clamp all radians to [0,359] degrees.
        // Offset by 90 degrees, because up (the start of the laser)
        // is at 90 degrees.
        d: (tan2deg(tan) + 360 - 90) % 360,
        x,
        y,
      };
    }),
    x => x.sort((a, b) => a.d - b.d),
  )(list);

  const bet = sorted[199];

  return bet.x * 100 + bet.y;
}

module.exports = {
  findWithMost,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));

  console.log("PART 2:", part2(input));
}
