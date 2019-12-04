function intSplit(input) {
  return [...String(input)].map(Number);
}

module.exports = {
  intSplit
};
