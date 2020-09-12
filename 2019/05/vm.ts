import { ASSERT, DEBUG } from "../util/test";
import { intSplit, intCombine } from "../util/int";
import { arrayPad } from "../util/array";

type MemMode = 0 | 1;
const POSITION_MODE = 0 as MemMode;
const IMMEDIATE_MODE = 1 as MemMode;

type Modes = MemMode[];
type Params = number[];
type Mem = number[];
type Inputs = number[];

type OpCode = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 99;

interface OpInput {
  name: string;
  opcode: OpCode;
  numargs: number;
  numouts: number;
  fn(modes: Modes, params: Params, mem: Mem, vmState?: VmState);
}

type VmState = {
  shouldExit: boolean;
  inputs: Inputs;
};

interface Op extends OpInput {
  len: number;
}

type OpMap = Map<OpCode, Op>;

export function get(mem: Mem, mode: MemMode, value: number) {
  return Number(mode === IMMEDIATE_MODE ? value : mem[value]);
}

export function set(mem: Mem, position, value) {
  mem[position] = Number(value);
}

function getOpcode(value: number) {
  const parts = intSplit(value);

  // [ opcode, rawmodes ]
  return [intCombine(parts.slice(-2)), parts.slice(0, -2).reverse()];
}

export function getInstruction(mem: Mem, pc, ops: OpMap) {
  const [opcode, rawModes] = getOpcode(mem[pc]);

  ASSERT(ops.has(opcode), `FATAL: Invalid opcode found at ${pc}: '${opcode}'`);

  const op = ops.get(opcode);

  const [, ...params] = mem.slice(pc, pc + op.len);
  const modes = arrayPad(rawModes, op.numargs, 0);

  return { opcode, modes, params };
}

export function OPMAP(oplist: OpInput[]): OpMap {
  return oplist.reduce((acc, op) => {
    acc.set(op.opcode as OpCode, {
      ...op,
      len: op.numargs + op.numouts + 1,
    });

    return acc;
  }, new Map<OpCode, Op>());
}

export function runProgram(mem: Mem, ops: OpMap, inputs: Inputs = []) {
  const vmState: VmState = {
    inputs,
    shouldExit: false,
  };

  let pc = 0;

  while (!vmState.shouldExit) {
    const { opcode, modes, params } = getInstruction(mem, pc, ops);

    DEBUG(`OP[${pc}]: ${opcode} ${modes} ${params} `);
    ASSERT(ops.has(opcode), `Invalid opcode found: '${opcode} at pc:${pc}'`);

    const jump = ops.get(opcode).fn(modes, params, mem, vmState);

    if (Number.isInteger(jump)) {
      pc = jump;
    } else {
      pc += ops.get(opcode).len;
    }
  }

  return mem;
}
