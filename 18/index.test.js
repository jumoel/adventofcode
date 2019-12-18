const {
  part1,
  findAvailableKeysFromPos,
  clean,
  findInWorld,
} = require("./index");

function findAvailableKeysFromEntry(input) {
  const world = clean(input);

  const entry = findInWorld(world, "@");

  return findAvailableKeysFromPos(world, entry);
}

test.each([
  [
    `#########
     #b.A.@.a#
     #########`,
    [{ key: "a", x: 7, y: 1, dist: 2 }],
  ],
  [
    `#########
     #b.....@#
     #########`,
    [{ key: "b", x: 1, y: 1, dist: 6 }],
  ],
  [
    `#########
     #@......#
     #########`,
    [],
  ],
])("findAvailableKeysFromPos %#", (input, expected) => {
  expect(findAvailableKeysFromEntry(input)).toEqual(expected);
});

test.each([
  [
    `#########
     #b.A.@.a#
     #########`,
    8,
  ],
  // [
  //   `########################
  //    #f.D.E.e.C.b.A.@.a.B.c.#
  //    ######################.#
  //    #d.....................#
  //    ########################`,
  //   86,
  // ],
  // [
  //   `########################
  //    #...............b.C.D.f#
  //    #.######################
  //    #.....@.a.B.c.d.A.e.F.g#
  //    ########################`,
  //   132,
  // ],
  // [
  //   `#################
  //   #i.G..c...e..H.p#
  //   ########.########
  //   #j.A..b...f..D.o#
  //   ########@########
  //   #k.E..a...g..B.n#
  //   ########.########
  //   #l.F..d...h..C.m#
  //   #################`,
  //   136,
  // ],
])("part1 %#", (input, expected) => {
  expect(part1(input)).toEqual(expected);
});
