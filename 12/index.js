const { transpose, make2d, reduce } = require("../util/array");
const { compose } = require("../util/fp");
const { clone } = require("../util/obj");
const math = require("mathjs");

function runIteration(state) {
  // apply gravity
  for (let p1 = 0; p1 < state.ps.length; p1++) {
    for (let p2 = 0; p2 < state.ps.length; p2++) {
      if (p1 === p2) {
        continue;
      }

      for (let dimen = 0; dimen < 3; dimen++) {
        const diff = state.ps[p2][dimen] - state.ps[p1][dimen];

        if (diff === 0) {
          continue;
        }
        state.vs[p1][dimen] += diff / Math.abs(diff);
      }
    }
  }

  // apply velocity
  for (let p = 0; p < state.ps.length; p++) {
    for (let dimen = 0; dimen < 3; dimen++) {
      state.ps[p][dimen] += state.vs[p][dimen];
    }
  }

  return state;
}

function sum(a, b) {
  return a + b;
}

function part1(input) {
  const STEPS = 1000;

  let state = {
    ps: clone(input),
    vs: make2d(3, input.length, 0),
  };

  for (let step = 0; step < STEPS; step++) {
    state = runIteration(state);
  }

  const energies = compose(
    ({ ps, vs }) => {
      return [
        ps.map(p => p.map(d => Math.abs(d)).reduce(sum, 0)),
        vs.map(v => v.map(d => Math.abs(d)).reduce(sum, 0)),
      ];
    },
    ([ps, vs]) => {
      return ps.map((val, idx) => val * vs[idx]);
    },
    reduce(sum, 0),
  )(state);

  return energies;
}

function part2(input) {
  let state = {
    ps: clone(input),
    vs: make2d(3, input.length, 0),
  };

  /* For each dimension, X, Y and Z,
   * keep a set of seen coordinates and velocities for each moon */
  const prevs = [new Set(), new Set(), new Set()];

  /* For each dimension, in which step was a repition found? */
  const reps = [undefined, undefined, undefined];

  let step = 0;
  while (reps.some(r => r === undefined)) {
    const pts = transpose(state.ps);
    const vts = transpose(state.vs);

    for (let dimension = 0; dimension < 3; dimension++) {
      const key = String(pts[dimension].concat(vts[dimension]));

      if (reps[dimension] === undefined && prevs[dimension].has(key)) {
        reps[dimension] = step;
      }

      prevs[dimension].add(key);
    }

    state = runIteration(state);
    step += 1;
  }

  return math.lcm(...reps);
}

function cleanInput(input) {
  return input
    .replace(/[<>a-z=]/g, "")
    .split("\n")
    .map(l => l.split(",").map(s => Number(s.trim())));
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = cleanInput(readInput(__dirname, "input.txt"));

  console.log("PART 1:", part1(input));
  console.log("PART 2:", part2(input));
}
