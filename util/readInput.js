const fs = require("fs");
const path = require("path");

function readInput(dir, filename = "input.txt", trim = true) {
  const str = fs.readFileSync(path.resolve(dir, "./" + filename)).toString();

  return trim ? str.trim() : str;
}

module.exports = {
  readInput,
};
