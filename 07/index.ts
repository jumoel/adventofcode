import { DEBUG, ASSERT } from "../util/test";
import { permutations } from "../util/array";

import { get, set, OPMAP, runProgram, newVM } from "./vm";

const ops = OPMAP([
  {
    name: "ADD",
    opcode: 1,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

      DEBUG(`ADD: ${in1} ${in2} ${params[2]}`);

      set(vmState.mem, params[2], in1 + in2);
    },
  },

  {
    name: "MULT",
    opcode: 2,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

      DEBUG(`MULT: ${in1} ${in2} ${params[2]}`);

      set(vmState.mem, params[2], in1 * in2);
    },
  },

  {
    name: "INPUT",
    opcode: 3,
    numargs: 0,
    numouts: 1,
    fn(modes, params, vmState) {
      if (vmState.inputs.length === 0) {
        vmState.shouldSuspend = true;
        return;
      }
      const input = vmState.inputs.shift();
      ASSERT(Number.isInteger(input), "Received non-int input");
      DEBUG(`INPUT: ${input} ${params[0]}`);

      set(vmState.mem, params[0], input);
    },
  },

  {
    name: "OUTPUT",
    opcode: 4,
    numargs: 1,
    numouts: 0,
    fn(modes, params, vmState) {
      const output = get(vmState.mem, modes[0], params[0]);
      vmState.outputs.push(output);
      DEBUG("OUTPUT:", output);
    },
  },

  {
    name: "JNZ",
    opcode: 5,
    numargs: 2,
    numouts: 0,
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

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
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

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
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

      const value = in1 < in2 ? 1 : 0;

      DEBUG(`LT: ${in1} ${in2} ${value} ${params[2]}`);

      set(vmState.mem, params[2], value);
    },
  },

  {
    name: "EQ",
    opcode: 8,
    numargs: 2,
    numouts: 1,
    fn(modes, params, vmState) {
      const in1 = get(vmState.mem, modes[0], params[0]);
      const in2 = get(vmState.mem, modes[1], params[1]);

      const value = in1 === in2 ? 1 : 0;

      DEBUG(`EQ: ${in1} ${in2} ${value}`);

      set(vmState.mem, params[2], value);
    },
  },

  {
    name: "EXIT",
    opcode: 99,
    numargs: 0,
    numouts: 0,
    fn(modes, params, vmState) {
      DEBUG("HALT");
      vmState.shouldExit = true;
    },
  },
]);

function part1(program) {
  const versions = permutations([0, 1, 2, 3, 4]);

  const output = versions.map(phaseSettings => {
    const states = [
      newVM(program),
      newVM(program),
      newVM(program),
      newVM(program),
      newVM(program),
    ];

    let input = 0;

    for (let i = 0; i < states.length; i++) {
      states[i].inputs.push(phaseSettings[i]);
      states[i].inputs.push(input);

      const vm = runProgram(ops, states[i]);

      input = vm.outputs[vm.outputs.length - 1];
    }

    return input;
  });

  return Math.max(...output);
}

function part2(program) {
  const versions = permutations([5, 6, 7, 8, 9]);

  const output = versions.map(phaseSettings => {
    const states = [
      newVM(program),
      newVM(program),
      newVM(program),
      newVM(program),
      newVM(program),
    ];

    // Initial input
    for (let i = 0; i < states.length; i++) {
      states[i].inputs.push(phaseSettings[i]);
    }
    states[0].inputs.push(0);

    let i = 0;
    while (!states[i].shouldExit) {
      const state = states[i];

      const vm = runProgram(ops, state);
      const output = vm.outputs[vm.outputs.length - 1];
      states[i] = vm;

      // Next VM
      i = (i + 1) % states.length;

      states[i].inputs.push(output);
      states[i].shouldSuspend = false;
    }

    return states[states.length - 1].outputs.pop();
  });

  return Math.max(...output);
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = readInput(__dirname, "input.txt")
    .trim()
    .split("\n")
    .join("")
    .split(",")
    .map(Number);

  console.log("PART 1:", part1(program));
  console.log("PART 2:", part2(program));
}
