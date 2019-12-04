const OP_ADD = 1;
const OP_MUL = 2;
const OP_EXIT = 99;

function runProgram(program) {
  function shouldContinue(pc) {
    return program[pc] !== OP_EXIT;
  }

  function getInstructionLength(pc) {
    const opcode = get(pc);
    switch (opcode) {
      case OP_ADD:
      case OP_MUL:
        return 4;
      case OP_EXIT:
        return 0;
      default:
        console.error(`Unknown instruction at '${pc}: ${opcode}'`);
        process.exit(1);
    }
  }

  function getInstruction(pc) {
    return program.slice(pc, pc + getInstructionLength(pc));
  }

  function get(position) {
    return program[position];
  }

  function set(position, value) {
    program[position] = value;
  }

  let pc = 0;

  while (shouldContinue(pc)) {
    const instruction = getInstruction(pc);
    pc += instruction.length;

    const [opcode, in1, in2, out] = instruction;
    switch (opcode) {
      case OP_ADD:
        set(out, get(in1) + get(in2));
        break;
      case OP_MUL:
        set(out, get(in1) * get(in2));
        break;
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
    .split(",")
    .map(n => Number.parseInt(n, 10));

  console.log("Part 1:", runProgram([...program])[0]);

  // part 2
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const result = runProgramWithArgs([...program], noun, verb);

      if (result === 19690720) {
        console.log("Part 2", { noun, verb, result, code: 100 * noun + verb });
      }
    }
  }
}

module.exports = {
  runProgram
};
