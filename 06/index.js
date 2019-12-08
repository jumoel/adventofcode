const { ASSERT } = require("../util/test");
const { intersection } = require("../util/set");

function sanitize(input) {
  return input
    .trim()
    .split("\n")
    .map(s => s.trim());
}

function findDepth(hash, key, depth) {
  if (key === "COM") {
    return depth;
  }

  return findDepth(hash, hash[key], depth + 1);
}

function getOrbitList(input) {
  return sanitize(input).map(s => s.split(")"));
}

function getOrbitHash(input) {
  return input.reduce((acc, [com, orbitee]) => {
    ASSERT(!acc.hasOwnProperty(orbitee), `${orbitee} orbits multiple things`);

    acc[orbitee] = com;

    return acc;
  }, {});
}

function totalOrbits(input) {
  const orbits = getOrbitList(input);
  const orbitHash = getOrbitHash(orbits);

  return Object.keys(orbitHash).reduce((acc, orbitee) => {
    return acc + findDepth(orbitHash, orbitee, 0);
  }, 0);
}

function findPath(hash, key, path) {
  if (key === "COM") {
    return path;
  }

  const res = path === undefined ? [] : path.concat([key]);

  return findPath(hash, hash[key], res);
}

function shortestOrbitPath(input) {
  const orbits = getOrbitList(input);
  const orbitHash = getOrbitHash(orbits);

  const youToCom = findPath(orbitHash, "YOU");
  const sanToCom = findPath(orbitHash, "SAN");

  const crosses = intersection(new Set(youToCom), new Set(sanToCom));

  function crossDist(cross) {
    return youToCom.indexOf(cross) + sanToCom.indexOf(cross);
  }

  const sorted = [...crosses].sort((a, b) => {
    return crossDist(a) - crossDist(b);
  });

  const nearest = sorted.shift();

  return crossDist(nearest);
}

module.exports = {
  totalOrbits,
  shortestOrbitPath,
  findPath,
  getOrbitList,
  getOrbitHash,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");

  const input = readInput(__dirname);

  console.log("PART 1:", totalOrbits(input));
  console.log("PART 2:", shortestOrbitPath(input));
}
