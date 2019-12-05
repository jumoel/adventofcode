function intSplit(input) {
  return [...String(input)].map(Number);
}

function intCombine(arr) {
  return Number(arr.join(""));
}

module.exports = {
  intSplit,
  intCombine,
};
