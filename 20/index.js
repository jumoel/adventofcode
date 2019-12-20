const { compose } = require("../util/fp");
const { toLines, toChars } = require("../util/string");
const { map } = require("../util/array");
const { ASSERT } = require("../util/test");

const PASSAGE = ".";
const WALL = "#";
const PORTAL_REGEX = /[A-Z]/;
const PORTAL = "@";
const EMPTY = " ";

function get(w, x, y) {
  return (w && w[y] && w[y][x]) || {};
}

function set(w, x, y, v) {
  w[y][x] = v;
}

function makeWorld(input) {
  const world = compose(toLines, map(toChars))(input);

  let maxY = world.length;
  let maxX = -Infinity;

  for (const line of world) {
    if (line.length > maxX) {
      maxX = line.length;
    }
  }

  // Two pass solution to first convert everything to a proper type
  // and the afterwards clean up the portals
  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const tile = world[y][x] || EMPTY;

      if (tile === PASSAGE || tile === WALL || tile === EMPTY) {
        set(world, x, y, { type: tile });
        continue;
      }

      if (tile.match(PORTAL_REGEX)) {
        set(world, x, y, { type: PORTAL, letter: tile });
        continue;
      }

      console.error(tile);
      ASSERT(false, "Invalid tile");
    }
  }

  const phonebook = new Map();

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      const tile = get(world, x, y);

      if (tile.type !== PORTAL) {
        continue;
      }

      const nextXTile = get(world, x + 1, y);
      if (nextXTile.type === PORTAL) {
        const passageOnRight = get(world, x + 2, y).type === PASSAGE;

        const name = tile.letter + nextXTile.letter;

        const target = passageOnRight ? [x + 2, y] : [x - 1, y];
        const fake = passageOnRight ? [x, y] : [x + 1, y];
        const real = passageOnRight ? [x + 1, y] : [x, y];

        set(world, real[0], real[1], { type: PORTAL, name, target });
        set(world, fake[0], fake[1], { type: EMPTY });

        if (!phonebook.has(name)) {
          phonebook.set(name, []);
        }

        phonebook.get(name).push(real);
        continue;
      }

      const nextYTile = get(world, x, y + 1);
      if (nextYTile.type === PORTAL) {
        const passageOnBottom = get(world, x, y + 2).type === PASSAGE;

        const name = tile.letter + nextYTile.letter;

        const target = passageOnBottom ? [x, y + 2] : [x, y - 1];
        const fake = passageOnBottom ? [x, y] : [x, y + 1];
        const real = passageOnBottom ? [x, y + 1] : [x, y];

        set(world, real[0], real[1], { type: PORTAL, name, target });
        set(world, fake[0], fake[1], { type: EMPTY });

        if (!phonebook.has(name)) {
          phonebook.set(name, []);
        }

        phonebook.get(name).push(real);
        continue;
      }

      if (tile.target) {
        // Already handled portal
        continue;
      }

      console.log(tile, x, y);
      ASSERT(false, "Portal went wrong");
    }
  }

  return { world, phonebook };
}

function c(pos) {
  return pos.join(",");
}

function part1(input) {
  const { world, phonebook } = makeWorld(input);

  const entry = phonebook.get("AA")[0];
  const endPortal = phonebook.get("ZZ")[0];
  const [goalX, goalY] = get(world, endPortal[0], endPortal[1]).target;
  const seen = new Set();
  seen.add(c(entry));

  const queue = [{ pos: get(world, entry[0], entry[1]).target, dist: 0 }];

  let minDist = Infinity;
  while (queue.length > 0) {
    const work = queue.sort((a, b) => a.dist - b.dist).shift();

    const hk = c(work.pos);
    if (seen.has(hk)) {
      continue;
    }
    seen.add(hk);

    const [x, y] = work.pos;

    if (goalX === x && goalY === y && work.dist < minDist) {
      minDist = work.dist;
      continue;
    }

    const tile = get(world, x, y);

    ASSERT(tile.type !== EMPTY, "Hit the empty space", x, y, tile);

    if (tile.type === WALL) {
      continue;
    }

    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dx, dy]) => {
      let nextX = x + dx;
      let nextY = y + dy;

      if (seen.has(c([nextX, nextY]))) {
        return;
      }

      const nextTile = get(world, nextX, nextY);
      if (nextTile.type === PORTAL) {
        seen.add(c([nextX, nextY]));

        if (nextTile.name === "ZZ") {
          return;
        }

        const [opX, opY] = phonebook
          .get(nextTile.name)
          .filter(([px, py]) => px !== nextX && py !== nextY)
          .shift();
        const otherPortal = get(world, opX, opY);

        [nextX, nextY] = otherPortal.target;
      }

      queue.push({ pos: [nextX, nextY], dist: work.dist + 1 });
    });
  }

  return minDist;

  // for (let y = 0; y < world.length; y++) {
  //   for (let x = 0; x < world[0].length; x++) {
  //     process.stdout.write(world[y][x].type);
  //   }
  //   process.stdout.write("\n");
  // }
}

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt", false);

  console.log("PART 1:", part1(input));
  //   console.log("PART 2:", part2(input));
}
