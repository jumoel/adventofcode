const {
  validPassword,
  notDecreasing,
  validPassword2,
  hasNotMoreThanTwo,
  hasStrictPair,
} = require("./index.js");

test.each([
  [111111, true, true],
  [223450, false, false],
  [123789, true, false],
])("1: for %p should be %p,%p", (input, expectedDec, expected) => {
  expect(notDecreasing(input)).toBe(expectedDec);
  expect(validPassword(input)).toBe(expected);
});

test.each([
  [112233, true],
  [123444, false],
  [112233, true],
])("2: for %p it should be %p", (input, expected) => {
  expect(validPassword2(input)).toBe(expected);
});

test.each([
  [112233, true],
  [123444, false],
  [112233, true],
])("HNMTT: for %p it should be %p", (input, expected) => {
  expect(hasNotMoreThanTwo(input)).toBe(expected);
  expect(hasStrictPair(input)).toBe(expected);
});
