const { compose } = require("../util/fp");
const { trim, toLines, split } = require("../util/string");
const { map, sum, reduce, flatten, filter } = require("../util/array");
const { clone } = require("../util/obj");
const { ASSERT, logIdent } = require("../util/test");

function makeWorld(input) {
  return compose(trim, toLines, map(trim), map(split("")))(input);
}

function findInWorld(world, fn) {
  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      if (fn(world[y][x])) {
        return [x, y];
      }
    }
  }

  return [-1, -1];
}

function findAllInWorld(world, fn) {
  const res = [];

  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      if (fn(world[y][x])) {
        res.push([x, y, world[y][x]]);
      }
    }
  }

  return res;
}

function k(x, y, l) {
  return `${l.join(",")};${x},${y}`;
}

const PASSAGE = ".";
const ENTRY = "@";
const KEY_REGEX = /[a-z]/;
const DOOR_REGEX = /[A-Z]/;

function unlockAt(world, [x, y]) {
  const newWorld = clone(world);
  const found = newWorld[y][x];
  const isKey = found.match(KEY_REGEX);

  if (isKey) {
    newWorld[y][x] = PASSAGE;
    const [doorX, doorY] = findInWorld(
      newWorld,
      x => x === found.toUpperCase(),
    );

    if (doorX !== -1 && doorY !== -1) {
      newWorld[doorY][doorX] = PASSAGE;
    }
  }

  return [newWorld, isKey && found];
}

function isPassable(w, [x, y]) {
  return (
    w[y][x] === ENTRY ||
    w[y][x] === PASSAGE ||
    Boolean(w[y][x].match(KEY_REGEX))
  );
}

function makePhoneBook(world, allKeys) {
  const seen = {};
  const maxX = world[0].length - 1;
  const maxY = world.length - 1;

  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const from = [x, y];

      const queue = [[from, 0]];
      const visited = new Set();

      while (queue.length > 0) {
        const [[cx, cy], dist] = queue.shift();

        if (world[cy][cx] === "#") {
          continue;
        }

        if (world[cy][cx].match(/[a-z]/)) {
          seen[`${x},${y},${world[cy][cx]}`] = dist;
        }

        if (visited.has(`${cx},${cy}`)) {
          continue;
        }
        visited.add(`${cx},${cy}`);

        const next = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
        ]
          .map(([dx, dy]) => {
            return [cx + dx, cy + dy];
          })
          .filter(([nx, ny]) => nx >= 0 && nx <= maxX && ny >= 0 && ny <= maxY)
          .filter(([nx, ny]) => world[ny][nx] !== "#")
          .forEach(pos => queue.push([pos, dist + 1]));
      }
    }
  }

  return seen;
}

function part1(input) {
  const world = makeWorld(input);
  const entry = findInWorld(world, x => x === ENTRY);
  const allKeys = findAllInWorld(world, x => x.match(KEY_REGEX) !== null);

  const phonebook = makePhoneBook(world, allKeys);

  let queue = [[clone(world), entry, [], 0]];

  let min = Infinity;
  const memo = new Set();

  while (queue.length > 0) {
    const [w, [x, y], seen, dist] = queue.shift();
    const hk = k(x, y, seen);

    if (memo.has(hk)) {
      continue;
    }
    memo.add(hk);

    if (seen.length === allKeys.length) {
      if (dist - 1 < min) {
        min = dist - 1;
      }

      continue;
    }

    const [w2, unlockedKey] = unlockAt(w, [x, y]);

    // don't do this, but find the visible keys from
    // the current position and use the phonebook to find
    // the distances to them

    const nextSteps = [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ]
      .filter(([dx, dy]) => isPassable(w2, [x + dx, y + dy]))
      .map(([dx, dy]) => {
        return [
          clone(w2),
          [x + dx, y + dy],
          seen.concat([unlockedKey].filter(Boolean)),
          dist + 1,
        ];
      });

    queue = queue.concat(nextSteps);
  }

  return min;
}

function part2(input) {
  return input;
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt");

  const p1 = part1(input);
  const p2 = part2(input);

  console.log("PART 1:", p1);
  //   console.log("PART 2:", p2);
}
