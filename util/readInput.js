const fs = require("fs");
const path = require("path");

function readInput(dir) {
  return fs
    .readFileSync(path.resolve(dir, "./input.txt"))
    .toString()
    .trim();
}

module.exports = {
  readInput,
};
