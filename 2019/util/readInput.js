const fs = require("fs");
const path = require("path");

function readInput(dir, filename = "input.txt", trim = true) {
  const parts = dir.split("/")
  const day = Number.parseInt(parts.pop())
  const year = Number.parseInt(parts.pop())

  const root = path.resolve(__dirname, '../../')

  const str = fs.readFileSync(path.resolve(root, `input/${year}/${day}/${filename}`)).toString();

  return trim ? str.trim() : str;
}

module.exports = {
  readInput,
};
