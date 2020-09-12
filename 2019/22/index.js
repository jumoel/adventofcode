const { compose } = require("../util/fp");
const { toLines, toChars } = require("../util/string");
const { map } = require("../util/array");
const { range } = require("../util/range");
const { ASSERT } = require("../util/test");
const { trim } = require("../util/string");
const { clone } = require("../util/obj");

function findNumbers(input) {
  return input.match(/((-|\+)?\d+)/g).map(Number);
}

function shuffle(input, deck) {
  const lines = compose(trim, toLines, map(trim))(input);

  for (const line of lines) {
    if (line.startsWith("cut")) {
      const arg = findNumbers(line).shift();

      if (arg > 0) {
        const cut = deck.splice(0, arg);
        deck = deck.concat(cut);
      } else {
        const cut = deck.splice(arg);
        deck = cut.concat(deck);
      }

      continue;
    }

    if (line.startsWith("deal with")) {
      const arg = findNumbers(line).shift();

      const newdeck = clone(deck);
      let t = 0;
      for (let i = 0; i < newdeck.length; i++) {
        deck[t] = newdeck[i];
        t = (t + arg) % newdeck.length;
      }

      continue;
    }

    if (line.startsWith("deal into")) {
      deck = deck.reverse();
      continue;
    }
  }

  return deck;
}

function part1(input) {
  const decksize = 10007;
  let deck = range(0, decksize);
  return shuffle(input, deck).indexOf(2019);
}

function part2(input) {
  const decksize = 119315717514047; // A prime
  // Reverse the instructions
  // Work with arithetic on the resulting integer (2020) to
  // find out what it was before all the alterations
  return 0;
}

module.exports = {
  shuffle,
};

if (require.main === module) {
  const { readInput } = require("../util/readInput");
  const input = readInput(__dirname, "input.txt", false);

  console.log("PART 1:", part1(input));
  console.log("PART 2:", part2(input));
}
