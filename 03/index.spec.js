const {
  closestDistance,
  getTraveledPoints,
  stepClosestDistance
} = require("./index.js");

test.each([
  [
    `R75,D30,R83,U83,L12,D49,R71,U7,L72
    U62,R66,U55,R34,D71,R55,D58,R83`,
    159
  ],
  [
    `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
  U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`,
    135
  ]
])("closestDistance should work for %p", (input, expectedDistance) => {
  expect(closestDistance(input)).toBe(expectedDistance);
});

test.each([
  ["R1", new Set(["0,0", "1,0"])],
  ["R1,U1", new Set(["0,0", "1,0", "1,1"])],
  ["L1", new Set(["0,0", "-1,0"])],
  ["D1", new Set(["0,0", "0,-1"])],
  [
    "D1,R2,U1,L1,D2",
    new Set(["0,0", "0,-1", "1,-1", "2,-1", "2,0", "1,0", "1,-2"])
  ]
])("getTraveledPoints should work for %s", (line, expected) => {
  expect(new Set(getTraveledPoints(line.split(",")))).toEqual(expected);
});
