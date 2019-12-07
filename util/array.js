function arrayPad(arr, totalLength, value) {
  if (totalLength < arr.length) {
    return arr;
  }

  const newArr = new Array(totalLength - arr.length).fill(value);

  return arr.concat(newArr);
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

module.exports = {
  arrayPad,
  permutations,
};
