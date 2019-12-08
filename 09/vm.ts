import { ASSERT, DEBUG } from "../util/test";
import { intSplit, intCombine } from "../util/int";
import { arrayPad } from "../util/array";

type MemMode = 0 | 1;
const POSITION_MODE = 0 as MemMode;
const IMMEDIATE_MODE = 1 as MemMode;
const RELATIVE_MODE = 2 as MemMode;

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
  fn(modes: Modes, params: Params, vmState: VmState);
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

function ensureSize(vm, size) {
  if (vm.mem.length < size - 1) {
    DEBUG("VM MEM TOO SMALL");
    vm.mem = arrayPad(vm.mem, Math.floor(size * 1.5), 0);
  }
}

export function get(vm: VmState, mode: MemMode, value: number) {
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

export function set(vm: VmState, mode: MemMode, position: number, value) {
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

function getInstruction(mem: Mem, pc, ops: OpMap) {
  const [opcode, rawModes] = getOpcode(mem[pc]);

  ASSERT(
    ops.has(opcode as OpCode),
    `FATAL: Invalid opcode found at ${pc}: '${opcode}'`,
  );

  const op = ops.get(opcode as OpCode);

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

export function newVM({
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

export function runProgram(ops: OpMap, vmState: VmState) {
  while (!vmState.shouldExit) {
    const { opcode, modes, params } = getInstruction(
      vmState.mem,
      vmState.pc,
      ops,
    );

    ASSERT(
      ops.has(opcode as OpCode),
      `Invalid opcode found: '${opcode} at pc:${vmState.pc}'`,
    );

    const op = ops.get(opcode as OpCode);
    DEBUG(`\nOP[${vmState.pc}]: o:${op.name} m:${modes} p:${params} `);

    const jump = op.fn(modes, params, vmState);

    if (vmState.shouldSuspend) {
      break;
    }

    if (Number.isInteger(jump)) {
      vmState.pc = jump;
    } else {
      vmState.pc += op.len;
    }
  }

  return vmState;
}
