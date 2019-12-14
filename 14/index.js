const { compose } = require("../util/fp");
const { toLines, trim, split } = require("../util/string");
const { map, reduce } = require("../util/array");
const { clone } = require("../util/obj");

function clean(input) {
  return compose(
    trim,
    toLines,
    map(compose(split(" => "), map(trim))),
    map(([recipe, result]) => {
      const [resultCount, resultMat] = result.split(" ");
      return {
        [resultMat]: {
          amount: Number(resultCount),
          material: resultMat,
          parts: compose(
            split(","),
            map(compose(trim, split(" "))),
            map(([n, mat]) => {
              return [Number(n), mat];
            }),
          )(recipe),
        },
      };
    }),
    reduce((acc, x) => Object.assign(acc, x), {}),
  )(input);
}

function oreCostRec(recipes, remaining, surplus, count) {
  if (remaining.length === 0) {
    return count;
  }

  const p = remaining.shift();

  if (p.material === "ORE") {
    return oreCostRec(recipes, remaining, surplus, count + p.wanted);
  }

  if (!surplus.hasOwnProperty(p.material)) {
    surplus[p.material] = 0;
  }

  if (surplus[p.material] >= p.wanted) {
    surplus[p.material] -= p.wanted;
    return oreCostRec(recipes, remaining, surplus, count);
  }

  if (surplus[p.material] > 0) {
    p.wanted -= surplus[p.material];
    surplus[p.material] = 0;
  }

  const cycles = Math.ceil(p.wanted / p.amount);
  const extra = p.amount * cycles - p.wanted;

  surplus[p.material] += extra;

  const nextParts = p.parts.map(([amount, mat]) => {
    return {
      ...clone(recipes[mat]),
      wanted: amount * cycles,
    };
  });

  return oreCostRec(recipes, nextParts.concat(remaining), surplus, count);
}

function oreCost(input, wanted) {
  const recipes = {
    ...clean(input),
    ORE: { amount: 1, material: "ORE", parts: [] },
  };

  return oreCostRec(recipes, [{ ...clone(recipes["FUEL"]), wanted }], {}, 0);
}

function part1(input) {
  return oreCost(input, 1);
}

function part2(input) {
  const ORE_MAX = 1000000000000;
  let min = Math.floor(ORE_MAX / oreCost(input, 1));
  let max = min * 2;
  let best = -1;

  while (min != max) {
    const candidate = min + Math.floor((max - min) / 2);
    const cost = oreCost(input, candidate);

    if (cost === ORE_MAX) {
      return candidate;
    }

    if (cost > ORE_MAX) {
      max = candidate;
    } else if (cost < ORE_MAX) {
      best = candidate;

      if (candidate === min) {
        min += 1;
      } else {
        min = candidate;
      }
    }
  }

  return best;
}

module.exports = { oreCost };

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  console.log("PART 1:", part1(input));
  console.log("PART 2:", part2(input));
}
