function trim(str) {
  return str.trim();
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
};
