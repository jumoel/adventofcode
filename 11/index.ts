import { map, reduce, make2d } from "../util/array";
import { compose } from "../util/fp";
import { ASSERT, logIdent } from "../util/test";
import { imageToStr } from "../util/image";

import * as VM from "./vm";

const DIRS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const TURN_LEFT = 0;
const TURN_RIGHT = 1;

const WHITE = 1;
const BLACK = 0;

function newDirection(direction, rotation) {
  switch (rotation) {
    case TURN_RIGHT:
      return (direction + 1) % DIRS.length;
    case TURN_LEFT:
      return (direction - 1 + DIRS.length) % DIRS.length;
  }
}

function newPos(x, y, direction) {
  ASSERT(direction < DIRS.length, "Invalid direction, off by something");
  const dir = DIRS[direction];
  return [x + dir[0], y + dir[1]];
}

function c(x, y) {
  return `${x},${y}`;
}

function paint(program, initialColor) {
  let x = 0;
  let y = 0;
  let direction = UP;

  let vm = VM.make({ program });

  const painted = new Set();
  const colors = {
    [c(0, 0)]: initialColor,
  };

  while (!vm.shouldExit) {
    const currentColor = colors[c(x, y)] || BLACK;

    vm.inputs.push(currentColor);
    vm.shouldSuspend = false;
    VM.run(vm);

    ASSERT(vm.outputs.length === 2, "VM output seems wrong");

    const color = vm.outputs.shift();
    const rotation = vm.outputs.shift();

    painted.add(c(x, y));
    colors[c(x, y)] = color;

    direction = newDirection(direction, rotation);
    [x, y] = newPos(x, y, direction);
  }

  return { painted, colors };
}

function part1(program) {
  return paint(program, BLACK).painted.size;
}

function part2(program) {
  const { colors } = paint(program, WHITE);

  const colorEntries = Object.entries(colors).map(([coord, value]) => {
    const [x, y] = coord.split(",").map(Number);

    return [x, y, value];
  });

  const [minX, minY, maxX, maxY] = colorEntries.reduce(
    ([minx, miny, maxx, maxy], [x, y]) => {
      return [
        Math.min(minx, x),
        Math.min(miny, y),
        Math.max(maxx, x),
        Math.max(maxy, y),
      ];
    },
    [Infinity, Infinity, -Infinity, -Infinity],
  );
  const sizeX = maxX + minX * -1 + 1;
  const sizeY = maxY + minY * -1 + 1;

  const output = compose(
    map(([tx, ty, value]) => {
      // Offset to start at 0,0
      const x = tx + minX * -1;
      const y = ty + minY * -1;

      return [x, y, value];
    }),
    reduce((acc, [x, y, color]) => {
      acc[y][x] = color;

      return acc;
    }, make2d(sizeX, sizeY, BLACK)),
    x => x.reverse(),
    imageToStr,
  )(colorEntries);

  return "\n" + output;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  console.log("PART 1:", part1(program));
  console.log("PART 2:", part2(program));
}
