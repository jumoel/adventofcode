function trim(str) {
  return str.trim();
}

function split(where) {
  return str => str.split(where);
}

function toLines(str) {
  return str.split("\n");
}

function toChars(str) {
  return str.split("");
}

module.exports = {
  trim,
  toLines,
  toChars,
  split,
};
