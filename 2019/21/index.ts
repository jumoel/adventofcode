import * as VM from "./vm";

function ord(c) {
  return c.charCodeAt(0);
}

function chr(n) {
  return String.fromCharCode(n);
}

function springscript(input) {
  const ss = input
    .replace(/^#.*$/gm, "")
    .replace(/(\n){2,}/g, "\n")
    .trim()
    .concat("\n");

  return ss.split("").map(ord);
}

function runSpringScript(program, shouldOutput, ss) {
  const vm = VM.make({ program });
  let result = -1;

  const input = springscript(ss);

  VM.loop(
    vm,
    () => {
      return [input.shift()];
    },
    () => {
      vm.outputs.forEach(o => {
        if (o > 127) {
          result = o;
        } else if (shouldOutput) {
          process.stdout.write(chr(o));
        }
      });

      vm.outputs = [];
    },
  );

  return result;
}

function part1(program, shouldOutput) {
  return runSpringScript(
    program,
    shouldOutput,
    `
# Only jump if there's a hole
# in one of A or B or C
NOT A J
NOT B T
OR T J
NOT C T
OR T J

# Only jump if landing is ground
AND D J

WALK
`,
  );
}

function part2(program, shouldOutput) {
  return runSpringScript(
    program,
    shouldOutput,
    `
# Only jump if there's a hole
# in one of A or B or C
NOT A J
NOT B T
OR T J
NOT C T
OR T J

# Only jump if landing is ground
AND D J

# Is 2 jumps ground?
NOT H T
NOT T T
# Or is next walk after jumping is ground?
OR E T
# .. then jump
AND T J

RUN
`,
  );
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  const p1 = part1(program, false);
  const p2 = part2(program, false);

  console.log("PART 1:", p1);
  console.log("PART 2:", p2);
}
