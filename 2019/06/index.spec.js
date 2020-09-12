const {
  totalOrbits,
  shortestOrbitPath,
  getOrbitHash,
  getOrbitList,
  findPath,
} = require("./index.js");

test("totalOrbits", () => {
  const testInput = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;

  expect(totalOrbits(testInput)).toBe(42);
});

test("shortestOrbitPath", () => {
  const testInput = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
`;
  expect(shortestOrbitPath(testInput)).toBe(4);
});

test("findPath", () => {
  const testInput = `
COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN
`;
  const orbitHash = getOrbitHash(getOrbitList(testInput));

  expect(findPath(orbitHash, "K", [])).toEqual([..."KJEDCB"]);
  expect(findPath(orbitHash, "I", [])).toEqual([..."IDCB"]);
});
