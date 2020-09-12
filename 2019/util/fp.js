function compose(...fns) {
  return x => fns.reduce((acc, fn) => fn(acc), x);
}

module.exports = {
  compose,
};
