const { ASSERT } = require("./test");

function intersection(a, b) {
  const as = Array.isArray(a) ? new Set(a) : a;
  const bs = Array.isArray(a) ? new Set(a) : a;

  return new Set([...as].filter(x => bs.has(x)));
}

function union(a, b) {
  return new Set([...a, ...b]);
}

module.exports = {
  intersection,
  union,
};
