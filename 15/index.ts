import { clone } from "../util/obj";

import * as VM from "./vm";

function c([x, y]: [number, number]) {
  if (Array.isArray(x)) {
    return `${x[0]}.${x[1]}`;
  }
  return `${x},${y}`;
}

const HIT_WALL = 0;
const MOVED = 1;
const FOUND_OXYGEN = 2;

type Dir = 1 | 2 | 3 | 4;
const NORTH: Dir = 1;
const SOUTH: Dir = 2;
const WEST: Dir = 3;
const EAST: Dir = 4;

const DIRS = {
  [NORTH]: [0, 1],
  [SOUTH]: [0, -1],
  [EAST]: [1, 0],
  [WEST]: [-1, 0],
};

function runVMWithInput(vm: VM.VmState, input) {
  vm.inputs = vm.inputs.concat(input);
  vm.shouldSuspend = false;
  VM.run(vm);

  return vm.outputs;
}

function go(x: number, y: number, dir: Dir): [number, number] {
  const [dx, dy] = DIRS[dir];
  return [x + dx, y + dy];
}

function part1(program) {
  function createPosJobs(vm, visited, x, y, dist) {
    return [NORTH, SOUTH, EAST, WEST]
      .filter(dir => {
        return !visited.has(c(go(x, y, dir)));
      })
      .map(dir => {
        return { vm: clone(vm), x, y, dir, dist };
      });
  }

  let vm = VM.make({ program });

  const visited = new Set();
  const world = { [c([0, 0])]: MOVED };
  const cost = { [c([0, 0])]: 0 };
  let queue = createPosJobs(vm, visited, 0, 0, 0);

  let result;

  while (queue.length > 0) {
    const { vm, dir, x, y, dist } = queue.shift();

    const output = runVMWithInput(vm, [dir]);
    const res = output.shift();

    const newpos = go(x, y, dir);
    world[c(newpos)] = res;
    cost[c(newpos)] = dist + 1;
    visited.add(c(newpos));

    if (res !== HIT_WALL) {
      queue = queue.concat(
        createPosJobs(vm, visited, newpos[0], newpos[1], dist + 1),
      );
    }
    if (res === FOUND_OXYGEN) {
      result = { steps: dist + 1, pos: newpos };
    }
  }

  return { ...result, world };
}

function part2(program) {
  function createPosJobs(x, y, dist) {
    return [NORTH, SOUTH, EAST, WEST].map(dir => {
      const [newX, newY] = go(x, y, dir);
      return { x: newX, y: newY, dist };
    });
  }

  const visited = new Set();

  const { pos, world } = part1(program);

  const cost = { [c(pos)]: 0 };
  visited.add(c([0, 0]));
  let queue = createPosJobs(pos[0], pos[1], 1);

  while (queue.length > 0) {
    const { x, y, dist } = queue.shift();

    if (visited.has(c([x, y]))) {
      continue;
    }

    visited.add(c([x, y]));

    if (world[c([x, y])] == HIT_WALL) {
      continue;
    }

    if (!cost.hasOwnProperty(c([x, y]))) {
      cost[c([x, y])] = Infinity;
    }

    cost[c([x, y])] = Math.min(cost[c([x, y])], dist);

    queue = queue.concat(createPosJobs(x, y, dist + 1));
  }

  return Math.max(...Object.values(cost));
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const program = VM.parseProgram(readInput(__dirname, "input.txt"));

  console.log("PART 1:", part1(program).steps);
  console.log("PART 2:", part2(program));
}
