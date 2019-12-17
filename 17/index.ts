import * as readline from "readline";
import { chunk } from "../util/array";
import { ASSERT } from "../util/test";
import { imageToStrFn } from "../util/image";

import * as VM from "./vm";
import { deepStrictEqual, AssertionError } from "assert";

function runVMWithInput(vm: VM.VmState, input) {
  vm.inputs = vm.inputs.concat(input);
  vm.shouldSuspend = false;
  VM.run(vm);

  return vm.outputs;
}

const SCAFFOLD = 35;
const NEWLINE = 10;

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

const UP = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;

const RLEFT = 1;
const RRIGHT = -1;

// Up and down are reversed due to top-to bottom Y coord
const DIRS = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

function canMoveForward(dir, [x, y], img) {
  const d = DIRS[dir];

  const newX = x + d[0];
  const newY = y + d[1];

  if (newY < 0 || newY >= img.length) {
    return false;
  }

  if (newX < 0 || newX >= img[0].length) {
    return false;
  }

  return img[newY][newX] === SCAFFOLD;
}

function c(x, y) {
  return `${x},${y}`;
}

function moveForward(dir, [x, y], visited) {
  const d = DIRS[dir];

  const newX = x + d[0];
  const newY = y + d[1];

  const newRoverPos = [newX, newY];
  const ds = visited.has(c(x, y)) ? 0 : 1;

  visited.add(c(x, y));

  return { newRoverPos, ds };
}

function rotate(dir, rotation) {
  return (dir + 4 + rotation) % 4;
}

function canRotate(dir, rot, [x, y], img) {
  const newDir = rotate(dir, rot);
  const d = DIRS[newDir];

  const candX = x + d[0];
  const candY = y + d[1];

  if (candX < 0 || candX >= img[0].length || candY < 0 || candY >= img.length) {
    return false;
  }

  // console.log({
  //   dir,
  //   rot,
  //   newDir,
  //   d,
  //   x,
  //   y,
  //   candX,
  //   candY,
  //   content: img[candY][candX],
  // });
  return img[candY][candX] === SCAFFOLD;
}

function findGreedyPath(img) {
  let roverPos = img.reduce(
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

  let scaffoldCount = img.reduce((acc, line) => {
    return acc + line.filter(x => x === SCAFFOLD).length;
  }, 0);

  let dir = UP;
  const actions = [];
  const visited = new Set();

  while (scaffoldCount > 0) {
    if (canMoveForward(dir, roverPos, img)) {
      actions.push("F");
      const { newRoverPos, ds } = moveForward(dir, roverPos, visited);

      scaffoldCount -= ds;
      roverPos = newRoverPos;
    } else if (canRotate(dir, RLEFT, roverPos, img)) {
      actions.push("L");
      dir = rotate(dir, RLEFT);
    } else if (canRotate(dir, RRIGHT, roverPos, img)) {
      actions.push("R");
      dir = rotate(dir, RRIGHT);
    } else {
      ASSERT(false, "Should never happen");
    }
  }

  return actions;
}

function compress(path) {
  return path.reduce((acc, elem) => {
    if (elem !== "F") {
      acc.push(elem);
      return acc;
    }

    if (acc.length === 0) {
      acc.push(1);
      return acc;
    }

    const last = acc[acc.length - 1];
    if (Number.isInteger(last)) {
      acc[acc.length - 1] += 1;
    } else {
      acc.push(1);
    }

    return acc;
  }, []);
}

function subroutine(compressed) {
  const commands = String(compressed);

  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) {
      for (let c = 1; c <= 20; c++) {
        const A = commands.substr(0, a);
        const withoutA = commands.replace(new RegExp(A + ",?", "g"), "");

        const B = withoutA.substr(0, b);
        const withoutB = withoutA.replace(new RegExp(B + ",?", "g"), "");

        const C = withoutB.substr(0, c);
        const withoutC = withoutB.replace(new RegExp(C + ",?", "g"), "");

        if (withoutC.length === 0) {
          return (
            commands
              .replace(new RegExp(A, "g"), "A")
              .replace(new RegExp(B, "g"), "B")
              .replace(new RegExp(C, "g"), "C") +
            "\n" +
            A +
            "\n" +
            B +
            "\n" +
            C +
            "\n"
          );
        }
      }
    }
  }

  ASSERT(false, "No solution found");
}

function part2(program) {
  const { img } = part1(program);

  const greedyPath = findGreedyPath(img);
  const compressed = compress(greedyPath);
  const subroutined = subroutine(compressed);

  const screenLength =
    img.length * // Y length is fine, but ...
      (img[0].length + 1) + // ... the image has newlines stripped from each line line, so its count is one off.
    1; // The full screen has a trailing newline, so handle that as well

  const writeOutput = "n"; // or 'y'

  const inputs = `${subroutined}${writeOutput}\n`.split("").map(ord);

  let vm = VM.make({ program: [2, ...program.slice(1)] });

  let initialDone = false;

  VM.loop(
    vm,
    () => {
      return [inputs.shift()];
    },
    outputs => {
      // @ts-ignore
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
