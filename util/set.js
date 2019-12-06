function SetIntersection(a, b) {
  return new Set([...a].filter(x => b.has(x)));
}

module.exports = {
  SetIntersection,
};
