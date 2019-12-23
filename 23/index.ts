import { range } from "../util/range";

import * as VM from "./vm";

function part1(program) {
  const num = 50;

  const network = { 255: [] };

  const vms = range(0, num).map(n => VM.make({ program, inputs: [n] }));

  while (network[255].length === 0) {
    for (let n = 0; n < vms.length; n++) {
      if (Array.isArray(network[n]) && network[n].length) {
        vms[n].inputs = vms[n].inputs.concat(network[n].splice(0));
      } else if (vms[n].shouldSuspend) {
        vms[n].inputs.push(-1);
      }
      vms[n].shouldSuspend = false;

      vms[n] = VM.run(vms[n], () => {
        if (vms[n].outputs.length === 3) {
          const [address, ...packet] = vms[n].outputs.splice(0);

          if (!Array.isArray(network[address])) {
            network[address] = [];
          }

          network[address] = network[address].concat(packet);
        }
      });
    }
  }

  return network[255][1];
}

function part2(program) {
  const num = 50;

  const network = { 255: [] };
  const seen = new Set();

  const vms = range(0, num).map(n => VM.make({ program, inputs: [n] }));

  while (true) {
    for (let n = 0; n < vms.length; n++) {
      if (Array.isArray(network[n]) && network[n].length) {
        vms[n].inputs = vms[n].inputs.concat(network[n].splice(0));
      } else if (vms[n].shouldSuspend) {
        vms[n].inputs.push(-1);
      }
      vms[n].shouldSuspend = false;

      vms[n] = VM.run(vms[n], () => {
        if (vms[n].outputs.length === 3) {
          const [address, ...packet] = vms[n].outputs.splice(0);

          if (!Array.isArray(network[address])) {
            network[address] = [];
          }

          network[address] = network[address].concat(packet);
        }
      });
    }

    const isEmpty = Object.keys(network)
      .filter(n => Number(n) !== 255)
      .every(n => network[n].length === 0);

    if (isEmpty && network[255].length > 0) {
      const y = network[255].pop();
      const x = network[255].pop();

      network[255] = [];

      if (seen.has(y)) {
        return y;
      }

      seen.add(y);

      network[0] = [x, y];
    }
  }
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  const p1 = part1(program);
  const p2 = part2(program);

  console.log("PART 1:", p1);
  console.log("PART 2:", p2);
}
