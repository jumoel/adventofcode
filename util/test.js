function DEBUG() {
  if (process.env.DEBUG) {
    console.log(...arguments);
  }
}

function ASSERT(cond, message) {
  if (!cond) {
    console.error("ASSERT FAIL:", message);
    process.exit(1);
  }
}

module.exports = {
  DEBUG,
  ASSERT,
};
