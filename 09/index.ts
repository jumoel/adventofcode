import { DEBUG, ASSERT } from "../util/test";
import { permutations, last } from "../util/array";

import { get, set, OPMAP, runProgram, newVM } from "./vm";

const ops = OPMAP([
  {
    name: "ADD",
    opcode: 1,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

      DEBUG(`ADD: ${in1} ${in2}`);

      set(vm, modes[2], params[2], in1 + in2);
    },
  },

  {
    name: "MULT",
    opcode: 2,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

      DEBUG(`MULT: ${in1} ${in2}`);

      set(vm, modes[2], params[2], in1 * in2);
    },
  },

  {
    name: "INPUT",
    opcode: 3,
    numargs: 0,
    numouts: 1,
    fn(modes, params, vm) {
      if (vm.inputs.length === 0) {
        vm.shouldSuspend = true;
        return;
      }

      const input = vm.inputs.shift();
      ASSERT(Number.isInteger(input), "Received non-integer input");
      DEBUG(`INPUT: ${input} ${params[0]}`);

      set(vm, modes[0], params[0], input);
    },
  },

  {
    name: "OUTPUT",
    opcode: 4,
    numargs: 1,
    numouts: 0,
    fn(modes, params, vm) {
      const output = get(vm, modes[0], params[0]);
      vm.outputs.push(output);
      DEBUG("OUTPUT:", output);
    },
  },

  {
    name: "JNZ",
    opcode: 5,
    numargs: 2,
    numouts: 0,
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

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
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

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
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

      const value = in1 < in2 ? 1 : 0;

      DEBUG(`LT: ${in1} ${in2} ${value}`);

      set(vm, modes[2], params[2], value);
    },
  },

  {
    name: "EQ",
    opcode: 8,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      const in2 = get(vm, modes[1], params[1]);

      const value = in1 === in2 ? 1 : 0;

      DEBUG(`EQ: ${in1} ${in2} ${value}`);

      set(vm, modes[2], params[2], value);
    },
  },

  {
    name: "RBS",
    opcode: 9,
    numargs: 1,
    numouts: 0,
    fn(modes, params, vm) {
      const in1 = get(vm, modes[0], params[0]);
      DEBUG(`RBS: ${in1}`);

      vm.rb = vm.rb + in1;
    },
  },

  {
    name: "EXIT",
    opcode: 99,
    numargs: 0,
    numouts: 0,
    fn(modes, params, vm) {
      DEBUG("HALT");
      vm.shouldExit = true;
    },
  },
]);

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = readInput(__dirname, "input.txt")
    .trim()
    .split(",")
    .map(Number);

  const vm1 = runProgram(ops, newVM({ program, inputs: [1] }));
  console.log("PART 1:", vm1.outputs);

  const vm2 = runProgram(ops, newVM({ program, inputs: [2] }));
  console.log("PART 2:", vm2.outputs);
}
