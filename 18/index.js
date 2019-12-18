const { compose } = require("../util/fp");
const { trim, toLines, split } = require("../util/string");
const { map, sum, reduce, flatten, filter } = require("../util/array");
const { clone } = require("../util/obj");
const { ASSERT, logIdent } = require("../util/test");

function clean(input) {
  return compose(trim, toLines, map(trim), map(split("")))(input);
}

function findInWorld(world, needle) {
  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      if (world[y][x] === needle) {
        return [x, y];
      }
    }
  }

  return [-1, -1];
}

function findMatchesInWorld(world, fn) {
  return compose(map(filter(x => fn(x))), flatten)(world);
}

function c(x, y) {
  return `${x},${y}`;
}

const ENTRY = "@";
const WALL = "#";
const PASSAGE = ".";
const KEY_REGEX = /[a-z]/;
const DOOR_REGEX = /[A-Z]/;

function findAvailableKeysFromPos(world, pos) {
  const visited = new Set();
  const queue = [[...pos, 0]];
  const result = [];
  const yMax = world.length - 1;
  const xMax = world[0].length - 1;

  while (queue.length > 0) {
    const [x, y, dist] = queue.shift();

    if (x < 0 || y < 0 || x > xMax || y > yMax) {
      continue;
    }

    if (visited.has(c(x, y))) {
      continue;
    }

    visited.add(c(x, y));

    const tile = world[y][x];

    if (tile === WALL) {
      continue;
    }

    if (tile.match(DOOR_REGEX) !== null) {
      continue;
    }

    if (tile.match(KEY_REGEX)) {
      result.push({ key: tile, x, y, dist });
      continue;
    }

    queue.push(
      [x + 1, y, dist + 1],
      [x - 1, y, dist + 1],
      [x, y + 1, dist + 1],
      [x, y - 1, dist + 1],
    );
  }

  return result;
}

function unlockDoor(world, key) {
  const worldClone = clone(world);

  const [doorX, doorY] = findInWorld(worldClone, key.key.toUpperCase());

  worldClone[key.y][key.x] = PASSAGE;

  if (doorX !== -1 && doorY !== -1) {
    worldClone[doorY][doorX] = PASSAGE;
  }

  return worldClone;
}

function walkRecursive(world, startPos, keyToTake, keysLeft, dist, meme) {
  console.log(...arguments);
  if (keysLeft.length === 1) {
    return dist + keyToTake.dist;
  }

  const hashKey =
    String(startPos) +
    ";" +
    clone(keysLeft)
      .sort()
      .join("-");

  if (meme.has(hashKey)) {
    return meme.get(hashKey);
  }

  console.log(hashKey);

  const nextWorld = unlockDoor(world, keyToTake);

  const keys = findAvailableKeysFromPos(nextWorld, startPos);

  const results = keys.map(nextKeyToTake =>
    walkRecursive(
      nextWorld,
      [keyToTake.x, keyToTake.y],
      nextKeyToTake,
      keys
        .map(k => k.key)
        .filter(k => k !== keyToTake.key && nextKeyToTake.key !== k),
      dist + keyToTake.dist,
      meme,
    ),
  );

  const result = Math.min(...results);

  meme.set(hashKey, result);

  return result;
}

function part1(input) {
  const world = clean(input);
  const entryPos = findInWorld(world, ENTRY);
  const keysLeft = findMatchesInWorld(world, x => x.match(KEY_REGEX) !== null);

  const entryKeys = findAvailableKeysFromPos(world, entryPos);

  const meme = new Map();

  return Math.min(
    ...entryKeys.map(keyToTake =>
      walkRecursive(
        world,
        entryPos,
        keyToTake,
        keysLeft.filter(k => k !== keyToTake.key),
        0,
        meme,
      ),
    ),
  );
}

function part2(input) {
  return input;
}

module.exports = {
  part1,
  findAvailableKeysFromPos,
  clean,
  findInWorld,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  const p1 = part1(input);
  const p2 = part2(input);

  console.log("PART 1:", p1);
  //   console.log("PART 2:", p2);
}
