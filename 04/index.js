const { range } = require("../util/range");

function hasDouble(input) {
  return String(input)
    .split("")
    .some((value, index, arr) => {
      if (index === 0) {
        return false;
      }

      return value === arr[index - 1];
    });
}

function hasNotMoreThanTwo(input) {
  return String(input)
    .replace(/((\d)\2*)/gu, "$1-")
    .split("-")
    .some(s => s.length === 2);
}

function hasLength(input) {
  return String(input).length === 6;
}

function notDecreasing(input) {
  let largest = -1;
  return [...String(input)].map(Number).every((value, index, arr) => {
    if (value < largest) {
      return false;
    }

    largest = value;
    return true;
  });
}

function validPassword(input) {
  return hasLength(input) && hasDouble(input) && notDecreasing(input);
}

function validPassword2(input) {
  return validPassword(input) && hasNotMoreThanTwo(input);
}

module.exports = {
  validPassword,
  notDecreasing,
  validPassword2,
  hasNotMoreThanTwo
};

if (require.main === module) {
  const fs = require("fs");
  const fileContent = fs.readFileSync(process.argv[2]).toString();
  const [begin, end] = fileContent
    .trim()
    .split("-")
    .map(Number);

  const inputs = range(begin, end, true);

  const valids = inputs.filter(validPassword);
  const valids2 = inputs.filter(validPassword2);

  console.log(valids.length, valids2.length);
}
