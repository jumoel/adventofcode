function imageToStr(arr, colors = { 1: "▒", 0: " " }) {
  return arr.map(line => line.map(v => colors[v] || v).join("")).join("\n");
}

function imageToStrFn(arr, fn) {
  return arr.map(line => line.map(fn).join("")).join("\n");
}

function worldMapToArr(world) {
  const entries = Object.entries(world);
  const [minX, minY, maxX, maxY] = entries.reduce(
    ([minX, minY, maxX, maxY], [key]) => {
      const [x, y] = key.split(",").map(Number);

      return [
        Math.min(minX, x),
        Math.min(minY, y),
        Math.max(maxX, x),
        Math.max(maxY, y),
      ];
    },
    [Infinity, Infinity, -Infinity, -Infinity],
  );

  return entries.reduce((acc, [key, value]) => {
    const [x, y] = key.split(",").map(Number);

    ASSERT(x - minX >= 0, "neg X");
    ASSERT(y - minY >= 0, "neg Y");

    acc[y - minY][x - minX] = value;

    return acc;
  }, make2d(maxX - minX + 1, maxY - minY + 1, 0));
}

module.exports = {
  imageToStr,
  imageToStrFn,
  worldMapToArr,
};
