const { getBaseSignal, FFT, part2 } = require("./index");

test("getBaseSignal", () => {
  expect(getBaseSignal(1)).toEqual([0, 1, 0, -1]);
  expect(getBaseSignal(2)).toEqual([0, 0, 1, 1, 0, 0, -1, -1]);
  expect(getBaseSignal(3)).toEqual([0, 0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1]);
});

test("FFT", () => {
  expect(FFT("12345678", 1)).toEqual("48226158");
  expect(FFT("12345678", 2)).toEqual("34040438");
  expect(FFT("12345678", 3)).toEqual("03415518");
  expect(FFT("12345678", 4)).toEqual("01029498");

  expect(FFT("80871224585914546619083218645595", 100)).toStartWith("24176176");
  expect(FFT("19617804207202209144916044189917", 100)).toStartWith("73745418");
  expect(FFT("69317163492948606335995924319873", 100)).toStartWith("52432133");
});

test("part2", () => {
  expect(part2("03036732577212944063491565474664")).toEqual("84462026");
  expect(part2("02935109699940807407585447034323")).toEqual("78725270");
  expect(part2("03081770884921959731165446850517")).toEqual("53553731");
});
