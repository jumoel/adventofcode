import { intSplit, intCombine } from "../util/int";
import { DEBUG, ASSERT } from "../util/test";

import { get, set, getInstruction, OPMAP, runProgram } from "./vm";

const ops = OPMAP([
  {
    name: "ADD",
    opcode: 1,
    numargs: 2,
    numouts: 1,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      DEBUG(`ADD: ${in1} ${in2} ${params[2]}`);

      set(mem, params[2], in1 + in2);
    },
  },

  {
    name: "MULT",
    opcode: 2,
    numargs: 2,
    numouts: 1,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      DEBUG(`MULT: ${in1} ${in2} ${params[2]}`);

      set(mem, params[2], in1 * in2);
    },
  },

  {
    name: "INPUT",
    opcode: 3,
    numargs: 0,
    numouts: 1,
    fn(modes, params, mem, vmState) {
      const input = vmState.inputs.shift();

      DEBUG(`INPUT: ${input} ${params[0]}`);

      set(mem, params[0], input);
    },
  },

  {
    name: "OUTPUT",
    opcode: 4,
    numargs: 1,
    numouts: 0,
    fn(modes, params, mem) {
      console.log("OUTPUT:", get(mem, modes[0], params[0]));
    },
  },

  {
    name: "JNZ",
    opcode: 5,
    numargs: 2,
    numouts: 0,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      DEBUG(`JNZ: ${in1} ${in2}`);

      if (in1 !== 0) {
        DEBUG(`JUMPING TO ${in2}`);
        return in2;
      }
    },
  },

  {
    name: "JZ",
    opcode: 6,
    numargs: 2,
    numouts: 0,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      DEBUG(`JZ: ${in1} ${in2}`);

      if (in1 === 0) {
        DEBUG(`JUMPING TO ${in2}`);
        return in2;
      }
    },
  },

  {
    name: "LT",
    opcode: 7,
    numargs: 2,
    numouts: 1,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      const value = in1 < in2 ? 1 : 0;

      DEBUG(`LT: ${in1} ${in2} ${value} ${params[2]}`);

      set(mem, params[2], value);
    },
  },

  {
    name: "EQ",
    opcode: 8,
    numargs: 2,
    numouts: 1,
    fn(modes, params, mem) {
      const in1 = get(mem, modes[0], params[0]);
      const in2 = get(mem, modes[1], params[1]);

      const value = in1 === in2 ? 1 : 0;

      DEBUG(`EQ: ${in1} ${in2} ${value}`);

      set(mem, params[2], value);
    },
  },

  {
    name: "EXIT",
    opcode: 99,
    numargs: 0,
    numouts: 0,
    fn(modes, params, mem, vmState) {
      console.log("HALT");
      vmState.shouldExit = true;
    },
  },
]);

function runProgramWithArgs(program, noun, verb) {
  program[1] = noun;
  program[2] = verb;

  return runProgram(program, ops)[0];
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = readInput(__dirname)
    .trim()
    .split(",")
    .map(Number);

  console.log("PART 1:");
  runProgram([...program], ops, [1]);

  console.log();

  console.log("PART 2:");
  runProgram([...program], ops, [5]);
}
