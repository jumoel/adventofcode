import { ASSERT, DEBUG } from "../util/test";
import { intSplit, intCombine } from "../util/int";
import { arrayPad } from "../util/array";

type MemMode = 0 | 1 | 2;
const POSITION_MODE: MemMode = 0;
const IMMEDIATE_MODE: MemMode = 1;
const RELATIVE_MODE: MemMode = 2;

type Modes = MemMode[];
type Params = number[];
type Mem = number[];
type Inputs = number[];
type Outputs = number[];

type OpCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 99;

interface OpInput {
  name: string;
  opcode: OpCode;
  numargs: number;
  numouts: number;
  fn(modes: Modes, params: Params, vm: VmState);
}

type VmState = {
  shouldExit: boolean;
  shouldSuspend: boolean;
  inputs: Inputs;
  outputs: Outputs;
  pc: number;
  rb: number;
  mem: Mem;
};

interface Op extends OpInput {
  len: number;
}

type OpMap = Map<OpCode, Op>;

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

function ensureSize(vm, size) {
  if (vm.mem.length < size - 1) {
    DEBUG("VM MEM TOO SMALL");
    vm.mem = arrayPad(vm.mem, size * 2, 0);
  }
}

function get(vm: VmState, mode: MemMode, value: number) {
  switch (mode) {
    case IMMEDIATE_MODE:
      DEBUG(`GET: immediate ${value}`);
      return value;
    case RELATIVE_MODE:
      DEBUG(`GET: relative (${vm.rb})+(${value})=${vm.rb + value}`);
      ensureSize(vm, vm.rb + value);
      return vm.mem[vm.rb + value];
    default:
      DEBUG(`GET: position ${value}`);
      ensureSize(vm, value);
      return vm.mem[value];
  }
}

function set(vm: VmState, mode: MemMode, position: number, value) {
  ASSERT(mode !== IMMEDIATE_MODE, "set does not work with immediate mode");

  switch (mode) {
    case RELATIVE_MODE:
      const addr = vm.rb + position;
      DEBUG(`SET: relative (${vm.rb})+(${position})=${addr}`);
      ensureSize(vm, addr);
      vm.mem[addr] = Number(value);
      break;
    default:
      DEBUG(`SET: position ${position}`);
      ensureSize(vm, position);
      vm.mem[position] = Number(value);
      break;
  }

  const offset = mode === RELATIVE_MODE ? vm.rb : 0;
}

function getOpcode(value: number) {
  const parts = intSplit(value);

  // [ opcode, rawmodes ]
  return [intCombine(parts.slice(-2)), parts.slice(0, -2).reverse()];
}

function getInstruction(mem: Mem, pc) {
  const [opcode, rawModes] = getOpcode(mem[pc]);

  ASSERT(ops.has(opcode), `FATAL: Invalid opcode found at ${pc}: '${opcode}'`);

  const op = ops.get(opcode);

  const [, ...params] = mem.slice(pc, pc + op.len);
  const modes = arrayPad(rawModes, op.numargs, 0);

  return { opcode, modes, params };
}

function OPMAP(oplist: OpInput[]): OpMap {
  return oplist.reduce((acc, op) => {
    acc.set(op.opcode, {
      ...op,
      len: op.numargs + op.numouts + 1,
    });

    return acc;
  }, new Map<OpCode, Op>());
}

export function make({
  program = [],
  inputs = [],
  initialMemSize = 8192,
}): VmState {
  // spreading in here is to ensure it's a deep copy of the integers
  return {
    inputs: [...inputs],
    shouldExit: false,
    shouldSuspend: false,
    outputs: [],
    pc: 0,
    rb: 0,
    mem: arrayPad([...program], initialMemSize, 0),
  };
}

export function run(vm: VmState) {
  while (!vm.shouldExit) {
    const { opcode, modes, params } = getInstruction(vm.mem, vm.pc);

    const op = ops.get(opcode as OpCode);
    DEBUG(`\nOP[${vm.pc}]: o:${op.name} m:${modes} p:${params} `);

    const jump = op.fn(modes, params, vm);

    if (vm.shouldSuspend) {
      break;
    }

    if (Number.isInteger(jump)) {
      vm.pc = jump;
    } else {
      vm.pc += op.len;
    }
  }

  return vm;
}

export function parseProgram(input) {
  return input
    .trim()
    .split(",")
    .map(Number);
}

export async function loop(vm, handleInput, handleOutput) {
  while (!vm.shouldExit) {
    const inputs = await handleInput();
    vm.inputs = vm.inputs.concat(inputs);
    vm.shouldSuspend = false;
    run(vm);

    handleOutput(vm.outputs);
  }
}
