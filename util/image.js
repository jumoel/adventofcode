function imageToStr(arr, colors = { 1: "▒", 0: " " }) {
  return arr.map(line => line.map(v => colors[v] || " ").join("")).join("\n");
}

module.exports = {
  imageToStr,
};
