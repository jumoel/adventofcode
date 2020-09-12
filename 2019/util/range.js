function range(begin, end, inclusive = false) {
  return [...Array(end - begin + (inclusive ? 1 : 0)).keys()].map(
    value => value + begin,
  );
}

module.exports = { range };
