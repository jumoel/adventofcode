const fs = require("fs");

function parseTravel(input) {
  const [direction, ...numbers] = input.split("");
  const amount = Number.parseInt(numbers.join(""), 10);

  return [direction, amount];
}

function dx(input) {
  const [direction, amount] = parseTravel(input);

  switch (direction) {
    case "D":
    case "U":
      return 0;
    case "R":
      return amount;
    case "L":
      return -amount;
    default:
      throw new Error(`Invalid direction '${direction}'`);
  }
}

function dy(input) {
  const [direction, amount] = parseTravel(input);

  switch (direction) {
    case "D":
      return -amount;
    case "U":
      return amount;
    case "R":
    case "L":
      return 0;
    default:
      throw new Error(`Invalid direction '${direction}'`);
  }
}

function getTraveledPoints(line) {
  return (
    line
      .reduce(
        (acc, travel, index) => {
          const [prevX, prevY] = acc[acc.length - 1];

          const tdx = dx(travel);
          const tdy = dy(travel);

          for (let y = 0; y <= Math.abs(tdy); y++) {
            for (let x = 0; x <= Math.abs(tdx); x++) {
              if (x !== 0 || y !== 0) {
                acc.push([
                  prevX + Math.sign(tdx) * x,
                  prevY + Math.sign(tdy) * y,
                ]);
              }
            }
          }

          return acc;
        },
        [[0, 0]],
      )
      // To get Set.prototype.has to work
      .map(([x, y]) => `${x},${y}`)
  );
}

function setIntersection(a, b) {
  return new Set([...a].filter(x => b.has(x)));
}

function getInput(input) {
  return input
    .trim()
    .split("\n")
    .map(input => input.trim().split(","));
}

function closestDistance(input) {
  const [first, second] = getInput(input);

  const traveledFirst = getTraveledPoints(first);
  const traveledSecond = getTraveledPoints(second);

  const crosses = setIntersection(
    new Set(traveledFirst),
    new Set(traveledSecond),
  );

  const distances = [...crosses]
    .map(str => str.split(",").map(n => Number.parseInt(n, 10)))
    .map(([x, y]) => Math.abs(x) + Math.abs(y))
    .filter(Boolean)
    .sort((a, b) => a - b);

  return distances.shift();
}

function stepClosestDistance(input) {
  const [first, second] = getInput(input);

  const traveledFirst = getTraveledPoints(first);
  const traveledSecond = getTraveledPoints(second);

  const crosses = setIntersection(
    new Set(traveledFirst),
    new Set(traveledSecond),
  );

  const stepDistances = [...crosses]
    .map(crossPos => {
      return (
        traveledFirst.findIndex(e => e === crossPos) +
        traveledSecond.findIndex(e => e === crossPos)
      );
    })
    .filter(Boolean)
    .sort((a, b) => a - b);

  return stepDistances.shift();
}

module.exports = {
  closestDistance,
  getTraveledPoints,
  stepClosestDistance,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const fileContent = readInput(__dirname);

  console.log("Manhattan distance:", closestDistance(fileContent));
  console.log("Step distance:", stepClosestDistance(fileContent));
}
