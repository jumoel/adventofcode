import * as readline from "readline";
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

function part2(program: number[]) {
  const newProgram = [2, ...program.slice(1)];
  let vm = VM.make({ program: newProgram });
  const SCREEN_X = 45;
  const SCREEN_Y = 23;
  const screen = make2d(SCREEN_X, SCREEN_Y, 0);
  let score = 0;
  let paddleX = 0;
  let ballX = 0;

  const blank = "\n".repeat(process.stdout.rows);
  process.stdout.write(blank);

  function input() {
    const diff = ballX - paddleX;
    return [diff === 0 ? 0 : diff / Math.abs(diff)];
  }

  function output(output) {
    ASSERT(output.length % 3 === 0, "VM output seems wrong");

    while (output.length > 0) {
      const x = output.shift();
      const y = output.shift();
      const type = output.shift();

      if (type === 3) {
        paddleX = x;
      }

      if (type === 4) {
        ballX = x;
      }

      if (x === -1 && y === 0) {
        score = type;
      } else {
        screen[y][x] = type;
      }
    }

    for (let slow = 0; slow < 300_000_000; slow++) {
      // YO
    }

    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);

    process.stdout.write(
      imageToStr(screen, {
        0: " ",
        1: "▓",
        2: "≡",
        3: "¯",
        4: "¤",
      }) + "\n",
    );

    process.stdout.write(
      `
${"".padStart(SCREEN_X, "░")}
░ SCORE: ${String(score).padStart(SCREEN_X - 4 - "SCORE: ".length, " ")} ░
${"".padStart(SCREEN_X, "░")}
`.trim(),
    );
  }

  VM.loop(vm, input, output);
  return score;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  // console.log("PART 1:", part1(program));

  console.log("\nPART 2:", part2(program));
}
