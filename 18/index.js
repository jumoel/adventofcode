const { compose } = require("../util/fp");
const { trim, toLines, split } = require("../util/string");
const { map, sum, reduce, flatten, filter } = require("../util/array");
const { clone } = require("../util/obj");
const { ASSERT, logIdent } = require("../util/test");

function clean(input) {
  return compose(trim, toLines, map(trim), map(split("")))(input);
}

function c(x, y) {
  return `${x},${y}`;
}

const ENTRY = "@";
const WALL = "#";
const PASSAGE = ".";
const KEY_REGEX = /[a-z]/;
const DOOR_REGEX = /[A-Z]/;

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

function findAllInWorld(world, fn) {
  const result = [];

  for (let y = 0; y < world.length; y++) {
    for (let x = 0; x < world[y].length; x++) {
      if (fn(world[y][x])) {
        result.push([x, y, world[y][x]]);
      }
    }
  }

  return result;
}

function pk([x, y], k) {
  return `${x},${y};${k}`;
}

function makePhoneBook(world, allKeys) {
  const seen = {};
  const maxX = world[0].length - 1;
  const maxY = world.length - 1;

  for (const origin of allKeys) {
    const [fromX, fromY, fromKey] = origin;

    const queue = [[[fromX, fromY], 0]];
    const visited = new Set();

    while (queue.length > 0) {
      const [[cx, cy], dist] = queue.shift();

      if (visited.has(`${cx},${cy}`)) {
        continue;
      }
      visited.add(`${cx},${cy}`);

      const tile = world[cy][cx];

      if (tile === WALL) {
        continue;
      }

      if (tile.match(KEY_REGEX)) {
        seen[pk([fromX, fromY], tile)] = dist;
      }

      [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ]
        .map(([dx, dy]) => {
          return [cx + dx, cy + dy];
        })
        .filter(([nx, ny]) => nx >= 0 && nx <= maxX && ny >= 0 && ny <= maxY)
        .filter(([nx, ny]) => world[ny][nx] !== WALL)
        .forEach(pos => queue.push([pos, dist + 1]));
    }
  }

  return seen;
}

function unlock(world, [x, y]) {
  const newWorld = clone(world);
  const found = newWorld[y][x];

  newWorld[y][x] = PASSAGE;

  if (found.match(KEY_REGEX)) {
    const door = found.toUpperCase();
    const [doorX, doorY] = findInWorld(newWorld, door);

    if (doorX !== -1) {
      newWorld[doorY][doorX] = PASSAGE;
    }
  }

  return newWorld;
}

function findAvailableKeys(world, entry) {
  const found = [];
  const queue = [entry];

  const seen = new Set();

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x < 0 || y < 0 || y >= world.length || x > world[0].length) {
      continue;
    }

    const k = `${x},${y}`;
    if (seen.has(k)) {
      continue;
    }
    seen.add(k);

    const tile = world[y][x];

    if (tile === WALL) {
      continue;
    }

    if (tile.match(DOOR_REGEX)) {
      continue;
    }

    if (tile.match(KEY_REGEX)) {
      found.push([tile, x, y]);
      continue;
    }

    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dx, dy]) => queue.unshift([x + dx, y + dy]));
  }

  return found;
}

function hashkey(pos, found) {
  return `${pos.join(",")};${found.join(",")}`;
}

function part1(input) {
  const world = clean(input);
  const entryPos = findInWorld(world, ENTRY);
  const allKeys = findAllInWorld(world, x => x.match(KEY_REGEX) !== null);
  const phonebook = makePhoneBook(
    world,
    allKeys.concat([[...entryPos, ENTRY]]),
  );
  const ak = new Map();

  const queue = [{ /* q: "", */ pos: entryPos, dist: 0, found: [], world }];

  let minimum = Infinity;

  while (queue.length > 0) {
    // console.log(queue.length);
    const work = queue.sort((a, b) => a.dist - b.dist).shift();

    const newWorld = unlock(work.world, work.pos);
    const hk = hashkey(work.pos, work.found.sort());

    if (work.found.length === allKeys.length && work.dist < minimum) {
      minimum = work.dist;
    }

    if (ak.has(hk)) {
      continue;
    }

    const availableKeys = findAvailableKeys(newWorld, work.pos);
    ak.set(hk, availableKeys);

    for (const k of availableKeys) {
      const [key, ...pos] = k;
      const newWork = {
        pos,
        // q: work.q + ` ${work.pos.join(",")};${key}`,
        dist: work.dist + phonebook[pk(work.pos, key)],
        found: work.found.concat([key]),
        world: newWorld,
      };

      queue.push(newWork);
    }
  }

  return minimum;
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
