import { clone } from "../util/obj";
import { imageToStrFn } from "../util/image";
import { chunk } from "../util/array";

import * as VM from "./vm";

function c([x, y]: [number, number]) {
  if (Array.isArray(x)) {
    return `${x[0]}.${x[1]}`;
  }
  return `${x},${y}`;
}

const HIT_WALL = 0;
const MOVED = 1;
const FOUND_OXYGEN = 2;

type Dir = 1 | 2 | 3 | 4;
const NORTH: Dir = 1;
const SOUTH: Dir = 2;
const WEST: Dir = 3;
const EAST: Dir = 4;

const DIRS = {
  [NORTH]: [0, 1],
  [SOUTH]: [0, -1],
  [EAST]: [1, 0],
  [WEST]: [-1, 0],
};

function runVMWithInput(vm: VM.VmState, input) {
  vm.inputs = vm.inputs.concat(input);
  vm.shouldSuspend = false;
  VM.run(vm);

  return vm.outputs;
}

function go(x: number, y: number, dir: Dir): [number, number] {
  const [dx, dy] = DIRS[dir];
  return [x + dx, y + dy];
}

const SCAFFOLD = 35;
const NEWLINE = 10;
const EMPTY_SPACE = 46;

function part1(program) {
  const vm = VM.make({ program });
  const imageIsh = runVMWithInput(vm, undefined);
  const lineLength = imageIsh.indexOf(10);
  const rawData = imageIsh.filter(x => x !== NEWLINE);
  const img2d = chunk(rawData, lineLength);

  const xMax = lineLength - 1;
  const yMax = rawData.length / lineLength - 1;

  const intersections = rawData.reduce((acc, c, i) => {
    if (c !== SCAFFOLD) {
      return acc;
    }

    const x = i % lineLength;
    const y = Math.floor(i / lineLength);

    if (x === 0 || x == xMax || y === 0 || y === yMax) {
      return acc;
    }

    const surrounded = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ].every(([dx, dy]) => {
      return img2d[y + dy][x + dx] === SCAFFOLD;
    });

    if (surrounded) {
      return acc + x * y;
    }

    return acc;
  }, 0);

  console.log(intersections);

  return imageToStrFn(img2d, c => String.fromCharCode(c));
}

function part2(program) {}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  console.log("PART 1:");
  process.stdout.write(part1(program));
  // console.log("PART 2:", part2(program));
}
