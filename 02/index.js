const program = "1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,13,1,19,1,5,19,23,2,10,23,27,1,27,5,31,2,9,31,35,1,35,5,39,2,6,39,43,1,43,5,47,2,47,10,51,2,51,6,55,1,5,55,59,2,10,59,63,1,63,6,67,2,67,6,71,1,71,5,75,1,13,75,79,1,6,79,83,2,83,13,87,1,87,6,91,1,10,91,95,1,95,9,99,2,99,13,103,1,103,6,107,2,107,6,111,1,111,2,115,1,115,13,0,99,2,0,14,0"
  .split(",")
  .map(n => Number.parseInt(n, 10));

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
  // part 1
  //console.log(runProgram(program)[0]);

  // part 2
  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const result = runProgramWithArgs([...program], noun, verb);

      if (result === 19690720) {
        console.log({ noun, verb, result, code: 100 * noun + verb });
      }
    }
  }
}

module.exports = {
  runProgram
};
