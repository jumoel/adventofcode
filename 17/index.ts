import * as readline from "readline";
import { clone } from "../util/obj";
import { imageToStrFn } from "../util/image";
import { chunk } from "../util/array";

import * as VM from "./vm";
import { write } from "../../../Library/Caches/typescript/3.7/node_modules/@types/graceful-fs";

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
  const img = chunk(rawData, lineLength);

  const xMax = lineLength - 1;
  const yMax = rawData.length / lineLength - 1;

  const count = rawData.reduce((acc, c, i) => {
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
      return img[y + dy][x + dx] === SCAFFOLD;
    });

    if (surrounded) {
      return acc + x * y;
    }

    return acc;
  }, 0);

  return { img, count };
}

function ord(c) {
  return c.charCodeAt(0);
}

function chr(n) {
  return String.fromCharCode(n);
}

function findGreedyPath(img) {
  const roverPos = img.reduce(
    (acc, line, y) => {
      if (acc[0] !== -1) {
        return acc;
      }

      const x = line.indexOf(ord("^"));

      if (x !== -1) {
        return [x, y];
      }

      return acc;
    },
    [-1, -1],
  );
}

function part2(program) {
  const { img } = part1(program);

  const greedyPath = findGreedyPath(img);

  const screenLength =
    img.length * // Y length is fine, but ...
      (img[0].length + 1) + // ... the image has newlines stripped from each line line, so its count is one off.
    1; // The full screen has a trailing newline, so handle that as well

  const writeOutput = "n"; // or 'y'
  const inputs = `A,B,A,C,B,C,B,C,A,B\nL,6,L,4,R,8\nR,8,L,6,L,4,L,10,R,8\nL,4,R,4,L,4,R,8\n${writeOutput}\n`
    .split("")
    .map(ord);

  let vm = VM.make({ program: [2, ...program.slice(1)] });

  let initialDone = false;

  VM.loop(
    vm,
    () => {
      return [inputs.shift()];
    },
    outputs => {
      if (writeOutput !== "y") {
        return;
      }

      // The program initially writes the full map
      // 65 is the length of prompts from the program
      // It messes with the live updating, so don't show it.
      if (!initialDone && outputs.length === screenLength + 65) {
        vm.outputs = [];
        initialDone = true;

        const blank = "\n".repeat(process.stdout.rows);
        process.stdout.write(blank);
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        return;
      }

      if (!initialDone) {
        return;
      }

      if (outputs.length % screenLength === 0 && outputs.length > 0) {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
        process.stdout.write(outputs.map(chr).join(""));
        vm.outputs = [];
      }

      if (vm.shouldExit) {
        return;
      }
    },
  );

  return vm.outputs.pop();
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  const p1 = part1(program).count;
  const p2 = part2(program);

  console.log("PART 1:", p1);
  console.log("PART 2:", p2);
}
