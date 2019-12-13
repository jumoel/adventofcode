import { map, reduce, make2d } from "../util/array";
import { compose } from "../util/fp";
import { ASSERT, logIdent } from "../util/test";
import { imageToStr } from "../util/image";

import * as VM from "./vm";

function c(x, y) {
  return `${x},${y}`;
}

function part1(program) {
  let vm = VM.make({ program });

  function input() {
    return [];
  }

  const screen = {};

  function output(output) {
    ASSERT(output.length % 3 === 0, "VM output seems wrong");

    while (output.length > 0) {
      const x = output.shift();
      const y = output.shift();
      const type = output.shift();

      screen[c(x, y)] = type;
    }
  }

  VM.loop(vm, input, output);

  return Object.values(screen).reduce(
    (acc: number, v: number) => acc + (v === 2 ? 1 : 0),
    0,
  );
}

async function part2(program: number[]) {
  const newProgram = [2, ...program.slice(1)];
  let vm = VM.make({ program: newProgram });
  const screen = make2d(50, 23, 0);

  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  async function input() {
    const answer = await new Promise(resolve => {
      rl.question("DIR? (L,R,nothing) ", dir => {
        // rl.close();
        if (dir === "L") {
          resolve(-1);
        } else if (dir === "R") {
          resolve(1);
        } else {
          resolve(0);
        }
      });
    });

    return [answer];
  }

  let score = 0;

  function output(output) {
    ASSERT(output.length % 3 === 0, "VM output seems wrong");

    while (output.length > 0) {
      const x = output.shift();
      const y = output.shift();
      const type = output.shift();

      if (x === -1 && y === 0) {
        score = type;
      } else {
        screen[y][x] = type;
      }
    }

    console.log(
      imageToStr(screen, {
        0: ".",
        1: "X",
        2: "O",
        3: "_",
        4: "+",
      }),
    );
  }

  await VM.loop(vm, input, output);
  return score;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  // console.log("PART 1:", part1(program));
  (async () => {
    console.log("PART 2:", await part2(program));
    return;
  })();
}
