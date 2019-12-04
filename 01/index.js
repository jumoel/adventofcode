function calculateFuelFromMass(mass) {
  return Math.floor(mass / 3) - 2;
}

function add(a, b) {
  return a + b;
}

function calculateRecursiveFuelFromMass(mass) {
  let fuelMass = 0;
  let moreFuel = mass;
  while ((moreFuel = calculateFuelFromMass(moreFuel)) > 0) {
    fuelMass += moreFuel;
  }

  return fuelMass;
}

module.exports = {
  calculateFuelFromMass,
  calculateRecursiveFuelFromMass
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");

  const payloads = readInput(__dirname)
    .split("\n")
    .filter(Boolean);

  const totalPayload = payloads.map(calculateFuelFromMass).reduce(add, 0);

  console.log("Part 1", totalPayload);

  const totalRecursivePayload = payloads
    .map(calculateRecursiveFuelFromMass)
    .reduce(add, 0);

  console.log("Part 2", totalRecursivePayload);
}
