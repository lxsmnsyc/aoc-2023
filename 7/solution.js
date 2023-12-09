import fs from 'fs/promises';

const test1 = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

const CARDS = '23456789TJQKA';
const CARDS2 = 'J23456789TQKA';

function scan(hand) {
  let slots = {};
  for (let i = 0; i < 5; i++) {
    const current = hand[i];
    slots[current] = (slots[current] || 0) + 1;
  }
  return slots;
}

function check(slots) {
  const keys = Object.keys(slots);
  switch (keys.length) {
    case 5: return 1; // high card
    case 4: return 2; // one pair
    case 3:
      if (slots[keys[0]] === 3 || slots[keys[1]] === 3 || slots[keys[2]] === 3) {
        return 4; // three-of-a-kind
      }
      return 3; // two-pair
    case 2:
      if (slots[keys[0]] === 4 || slots[keys[1]] === 4 || slots[keys[2]] === 4) {
        return 6; // 4-of-a-kind
      }
      return 5; // full house
    case 1:
      return 7; // 5-of-a-kind
  }
}

function parseInputs(input) {
  return input.split('\n')
    .map((line) => line.split(/\s+/));
}

function solution1(input) {
  const lines = parseInputs(input);

  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    const [hand] = line;
    const slots = scan(hand);
    line[2] = check(slots);
  }

  const sorted = [...lines];

  sorted.sort((a, b) => {
    const aValue = a[2];
    const bValue = b[2];
    if (aValue === bValue) {
      for (let i = 0; i < 5; i++) {
        const aCard = CARDS.indexOf(a[0][i]);
        const bCard = CARDS.indexOf(b[0][i]);
        if (aCard === bCard) {
          continue;
        }
        return aCard - bCard;
      }
    }
    return aValue - bValue;
  });
  let sum = 0;
  for (let i = 0, len = sorted.length; i < len; i++) {
    sum += (sorted[i][1] * (i + 1));
  }
  return sum;
}

function check2(slots) {
  const keys = Object.keys(slots);
  switch (keys.length) {
    case 5:
      if ('J' in slots) {
        return 2;
      }
      return 1; // high card
    case 4:
      if ('J' in slots) {
        return 4;
      }
      return 2; // one pair
    case 3:
      if (slots[keys[0]] === 3 || slots[keys[1]] === 3 || slots[keys[2]] === 3) {
        if ('J' in slots) {
          return 6;
        }
        return 4; // three-of-a-kind
      }
      if ('J' in slots) {
        if (slots.J === 2) {
          return 6;
        }
        return 5;
      }
      return 3; // two-pair
    case 2:
      if (slots[keys[0]] === 4 || slots[keys[1]] === 4 || slots[keys[2]] === 4) {
        if ('J' in slots) {
          return 7;
        }
        return 6; // 4-of-a-kind
      }
      if ('J' in slots) {
        if (slots.J === 2 || slots.J === 3) {
          return 7;
        }
        return 6;
      }
      return 5; // full house
    case 1:
      return 7; // 5-of-a-kind
  }
}

function solution2(input) {
  const lines = parseInputs(input);

  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    const [hand] = line;
    const slots = scan(hand);
    line[2] = check2(slots);
  }

  const sorted = [...lines];

  sorted.sort((a, b) => {
    const aValue = a[2];
    const bValue = b[2];
    if (aValue === bValue) {
      for (let i = 0; i < 5; i++) {
        const aCard = CARDS2.indexOf(a[0][i]);
        const bCard = CARDS2.indexOf(b[0][i]);
        if (aCard === bCard) {
          continue;
        }
        return aCard - bCard;
      }
    }
    return aValue - bValue;
  });
  let sum = 0;
  for (let i = 0, len = sorted.length; i < len; i++) {
    sum += (sorted[i][1] * (i + 1));
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
