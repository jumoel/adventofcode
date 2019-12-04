const { range } = require("../util/range");
const { intSplit } = require("../util/int");

function hasDouble(input) {
  return intSplit(input).some((value, index, arr) => {
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

// This was made after the fact to understand the logic behind the list indexing.
function hasStrictPair(input) {
  return intSplit(input).some((val, index, arr) => {
    const valid = index !== arr.length - 1 && val === arr[index + 1];
    const validPrev = index === 0 || val !== arr[index - 1];
    const validEnd = index === arr.length - 2 || val !== arr[arr.length - 2];

    return valid && validPrev && validEnd;
  });
}

function hasLength(input) {
  return String(input).length === 6;
}

function notDecreasing(input) {
  let largest = -1;
  return intSplit(input).every((value, index, arr) => {
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
  hasNotMoreThanTwo,
  hasStrictPair
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");

  const [begin, end] = readInput(__dirname)
    .split("-")
    .map(Number);

  const inputs = range(begin, end, true);

  const valids = inputs.filter(validPassword);
  const valids2 = inputs.filter(validPassword2);

  console.log(valids.length, valids2.length);
}
