const {
  calculateFuelFromMass,
  totalFuelMass,
  calculateRecursiveFuelFromMass,
  totalRecursivePayload
} = require("./index.js");

test.each([
  [12, 2],
  [14, 2],
  [1969, 654],
  [100756, 33583]
])("should be correct for %i and %i", (mass, expectedFuel) => {
  expect(calculateFuelFromMass(mass)).toBe(expectedFuel);
});

test("totalFuelMass: " + totalFuelMass, () => {
  expect(totalFuelMass).toBe(totalFuelMass);
});

test.each([
  [14, 2],
  [1969, 966],
  [100756, 50346]
])("total recursive for %i should be %i", (weight, totalFuel) => {
  expect(calculateRecursiveFuelFromMass(weight)).toBe(totalFuel);
});

test("totalRecursivePayload: " + totalRecursivePayload, () => {
  expect(totalRecursivePayload).toBe(totalRecursivePayload);
});
