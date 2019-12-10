const { ASSERT } = require("./test");

function arrayPad(arr, totalLength, value) {
  if (totalLength < arr.length) {
    return arr;
  }

  const newArr = new Array(totalLength - arr.length).fill(value);

  return arr.concat(newArr);
}

function last(arr) {
  if (arr.length === 0) {
    return undefined;
  }

  return arr[arr.length - 1];
}

function permutations(arr) {
  if (arr.length < 2) {
    return [...arr];
  }

  const res = [];

  for (let a = 0; a < arr.length; a++) {
    const rem = arr.slice(0, a).concat(arr.slice(a + 1));
    const perms = permutations(rem);

    for (let p = 0; p < perms.length; p++) {
      res.push([arr[a]].concat(perms[p]));
    }
  }

  return res;
}

function chunk(arr, size) {
  if (arr.length === 0) {
    return [];
  }

  return arr.reduce(
    (acc, e) => {
      if (acc[acc.length - 1].length < size) {
        acc[acc.length - 1].push(e);
      } else {
        acc.push([e]);
      }

      return acc;
    },
    [[]],
  );
}

function matches(arr, value) {
  return arr.filter(a => a === value).length;
}

function transpose(arr) {
  ASSERT(
    Array.isArray(arr) && arr.length > 0 && Array.isArray(arr[0]),
    "Transpose only works on arrays of arrays",
  );
  return arr[0].map((_, column) => arr.map(row => row[column]));
}

function flatten(arr) {
  return arr.reduce((acc, elem) => {
    return acc.concat(elem);
  }, []);
}

function map(fn) {
  return arr => arr.map(fn);
}

function filter(fn) {
  return arr => arr.filter(fn);
}

function reduce(fn, init) {
  return arr => arr.reduce(fn, init);
}

module.exports = {
  arrayPad,
  permutations,
  last,
  chunk,
  matches,
  transpose,
  flatten,
  map,
  filter,
  reduce,
};
