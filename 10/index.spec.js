const { findWithMost } = require("./index.js");

test("p1: example 1", () => {
  const input = `
  .#..#
  .....
  #####
  ....#
  ...##`;

  const output = findWithMost(input);
  expect(output.coord).toEqual([3, 4]);
  expect(output.visibles).toEqual(8);
});

test("p1: example 2", () => {
  const input = `
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

  const output = findWithMost(input);
  expect(output.coord).toEqual([5, 8]);
  expect(output.visibles).toEqual(33);
});

test("p1: example 3", () => {
  const input = `
  #.#...#.#.
  .###....#.
  .#....#...
  ##.#.#.#.#
  ....#.#.#.
  .##..###.#
  ..#...##..
  ..##....##
  ......#...
  .####.###.`;

  const output = findWithMost(input);
  expect(output.coord).toEqual([1, 2]);
  expect(output.visibles).toEqual(35);
});

test("p1: example 4", () => {
  const input = `
    .#..#..###
    ####.###.#
    ....###.#.
    ..###.##.#
    ##.##.#.#.
    ....###..#
    ..#.#..#.#
    #..#.#.###
    .##...##.#
    .....#.#..`;

  const output = findWithMost(input);
  expect(output.coord).toEqual([6, 3]);
  expect(output.visibles).toEqual(41);
});

test("p1: example 5", () => {
  const input = `
  .#..##.###...#######
  ##.############..##.
  .#.######.########.#
  .###.#######.####.#.
  #####.##.#.##.###.##
  ..#####..#.#########
  ####################
  #.####....###.#.#.##
  ##.#################
  #####.##.###..####..
  ..######..##.#######
  ####.##.####...##..#
  .#####..#.######.###
  ##...#.##########...
  #.##########.#######
  .####.#.###.###.#.##
  ....##.##.###..#####
  .#.#.###########.###
  #.#.#.#####.####.###
  ###.##.####.##.#..##`;

  const output = findWithMost(input);
  expect(output.coord).toEqual([11, 13]);
  expect(output.visibles).toEqual(210);
});
