const { intSplit, intCombine } = require("../util/int");
const { DEBUG, ASSERT } = require("../util/test");

const OP_ADD = 1;
const OP_MULT = 2;
const OP_INPUT = 3;
const OP_OUTPUT = 4;
const OP_JUMP_TRUE = 5;
const OP_JUMP_FALSE = 6;
const OP_LESS_THAN = 7;
const OP_EQUALS = 8;
const OP_EXIT = 99;

const POSITION_MODE = 0;
const IMMEDIATE_MODE = 1;

function argLength(opcode) {
  switch (opcode) {
    case OP_INPUT:
      return 1;
    case OP_OUTPUT:
      return 0;
    case OP_ADD:
      return 2;
    case OP_MULT:
      return 2;
    case OP_EXIT:
      return 0;
    case OP_JUMP_TRUE:
      return 2;
    case OP_JUMP_FALSE:
      return 2;
    case OP_LESS_THAN:
      return 2;
    case OP_EQUALS:
      return 2;

    default:
      console.error(`Unknown instruction: ${opcode}'`);
      process.exit(1);
  }
}

function arrayPad(arr, totalLength, value) {
  if (totalLength < arr.length) {
    return arr;
  }

  const newArr = new Array(totalLength - arr.length).fill(value);

  return arr.concat(newArr);
}

function runProgram(program, inputs = []) {
  let shouldExit = false;

  function I_OP_ADD(modes, params) {
    const in1 = get(modes[0], params[0]);
    const in2 = get(modes[1], params[1]);

    DEBUG(`ADD: ${in1} ${in2} ${params[2]}`);

    set(params[2], in1 + in2);
  }

  function I_OP_MULT(modes, params) {
    const in1 = get(modes[0], params[0]);
    const in2 = get(modes[1], params[1]);

    DEBUG(`MULT: ${in1} ${in2} ${params[2]}`);

    set(params[2], in1 * in2);
  }

  function I_OP_INPUT(modes, params) {
    const input = inputs.shift();

    DEBUG(`INPUT: ${input} ${params[0]}`);

    set(params[0], input);
  }

  function I_OP_OUTPUT(modes, params) {
    console.log("OUTPUT:", get(modes[0], params[0]));
  }

  function I_OP_EXIT(modes, params) {
    console.log("HALT");
    shouldExit = true;
  }

  function I_OP_JUMP_TRUE(modes, params) {
    const in1 = get(modes[0], params[0]);
    const out1 = get(modes[1], params[1]);

    DEBUG(`JT: ${in1} ${out1}`);

    if (in1 !== 0) {
      DEBUG(`JUMPING TO ${out1}`);
      return out1;
    }
  }

  function I_OP_JUMP_FALSE(modes, params) {
    const in1 = get(modes[0], params[0]);
    const out1 = get(modes[1], params[1]);

    DEBUG(`JF: ${in1} ${out1}`);

    if (in1 === 0) {
      DEBUG(`JUMPING TO ${out1}`);
      return out1;
    }
  }

  function I_OP_LESS_THAN(modes, params) {
    const in1 = get(modes[0], params[0]);
    const in2 = get(modes[1], params[1]);

    const value = in1 < in2 ? 1 : 0;

    DEBUG(`LT: ${in1} ${in2} ${value} ${params[2]}`);

    set(params[2], value);
  }

  function I_OP_EQUALS(modes, params) {
    const in1 = get(modes[0], params[0]);
    const in2 = get(modes[1], params[1]);

    const value = in1 === in2 ? 1 : 0;

    DEBUG(`EQ: ${in1} ${in2} ${value}`);

    set(params[2], value);
  }

  const OPS = {
    [OP_ADD]: I_OP_ADD,
    [OP_MULT]: I_OP_MULT,
    [OP_INPUT]: I_OP_INPUT,
    [OP_OUTPUT]: I_OP_OUTPUT,
    [OP_EXIT]: I_OP_EXIT,
    [OP_JUMP_TRUE]: I_OP_JUMP_TRUE,
    [OP_JUMP_FALSE]: I_OP_JUMP_FALSE,
    [OP_LESS_THAN]: I_OP_LESS_THAN,
    [OP_EQUALS]: I_OP_EQUALS,
  };

  const LENS = {
    [OP_ADD]: 1 + 2 + 1,
    [OP_MULT]: 1 + 2 + 1,
    [OP_INPUT]: 1 + 1,
    [OP_OUTPUT]: 1 + 1,
    [OP_EXIT]: 1,
    [OP_JUMP_TRUE]: 1 + 1 + 1,
    [OP_JUMP_FALSE]: 1 + 1 + 1,
    [OP_LESS_THAN]: 1 + 2 + 1,
    [OP_EQUALS]: 1 + 2 + 1,
  };

  function getOpcode(value) {
    const parts = intSplit(value);

    // [ opcode, modes ]
    return [intCombine(parts.slice(-2)), parts.slice(0, -2).reverse()];
  }

  function getInstructionLength(pc) {
    const [opcode] = getOpcode(get(POSITION_MODE, pc));

    ASSERT(LENS.hasOwnProperty(opcode), `Invalid opcode ${opcode} at ${pc}`);

    return LENS[opcode];
  }

  function getInstruction(pc) {
    const [opcodeRaw, ...params] = program.slice(
      pc,
      pc + getInstructionLength(pc),
    );
    const [opcode, rawModes] = getOpcode(opcodeRaw);

    const modes = arrayPad(rawModes, argLength(opcode), 0);

    return [opcode, modes, params];
  }

  function get(mode, value) {
    return Number(mode === IMMEDIATE_MODE ? value : program[value]);
  }

  function set(position, value) {
    program[position] = Number(value);
  }

  let pc = 0;

  while (!shouldExit) {
    const instruction = getInstruction(pc);

    const [opcode, modes, params] = instruction;

    DEBUG(`OP[${pc}]: ${opcode} ${modes} ${params} `);

    ASSERT(
      OPS.hasOwnProperty(opcode),
      `Invalid opcode found: '${opcode} at pc:${pc}'`,
    );

    const jump = OPS[opcode](modes, params);

    if (Number.isInteger(jump)) {
      pc = jump;
    } else {
      pc += getInstructionLength(pc);
    }
  }

  return program;
}

function runProgramWithArgs(program, noun, verb) {
  program[1] = noun;
  program[2] = verb;

  return runProgram(program)[0];
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = readInput(__dirname)
    .trim()
    .split(",")
    .map(Number);

  // console.log("PART 1:");
  // runProgram([...program], [1]);

  console.log();

  console.log("PART 2:");
  runProgram([...program], [5]);
}
