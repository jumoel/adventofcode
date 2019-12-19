import * as VM from "./vm";

function runVMWithInput(program, input) {
  const vm = VM.make({ program });
  vm.inputs = vm.inputs.concat(input);
  vm.shouldSuspend = false;
  VM.run(vm);

  return vm.outputs.shift();
}

function part1(program) {
  let count = 0;
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      const test = runVMWithInput(program, [x, y]);
      count += test;
    }
  }

  return count;
}

function part2(program) {
  const res = runVMWithInput(program, [0, 0]);

  let found = false;
  let y = 100;
  let minX = 0;
  while (!found && y < 10_000) {
    if (y % 100 === 0) {
      console.log({ y, minX });
    }

    // Find left bottom edge of tractor beam
    while (runVMWithInput(program, [minX, y]) === 0) {
      minX += 1;
    }

    // 100 wide is the current thing + 99, not + 100 🤦‍♂️
    if (runVMWithInput(program, [minX + 99, y - 99]) === 1) {
      break;
    }

    y += 1;
  }

  return minX * 10_000 + (y - 99);
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  console.log("PART 1:", part1(program));
  console.log("PART 2:", part2(program));
}
