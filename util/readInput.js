const fs = require("fs");
const path = require("path");

function readInput(dir, filename = "input.txt") {
  return fs
    .readFileSync(path.resolve(dir, "./" + filename))
    .toString()
    .trim();
}

module.exports = {
  readInput,
};
