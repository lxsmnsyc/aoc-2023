import fs from 'fs/promises';

const test1 = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`

function parseNumber(sequence) {
  return new Set(sequence.split(/\s+/));
}

function parseLine(line) {
  const [card, matches] = line.split(/:\s+/);
  const [winning, bets] = matches.split(' | ');
  return {
    card,
    winning: parseNumber(winning),
    bets: parseNumber(bets),
  }
}

function parseInputs(input) {
  const lines = input.split('\n');
  const cards = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    cards.push(parseLine(lines[i]));
  }
  return cards;
}

function getWinning(play) {
  let count = 0;
  for (const item of play.bets) {
    if (play.winning.has(item)) {
      count++;
    }
  }
  if (count === 0) {
    return 0;
  }
  return 2 ** (count - 1);
}

function solution1(input) {
  const result = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = result.length; i < len; i++) {
    sum += getWinning(result[i]);
  }
  return sum;
}

function getWins(play) {
  let count = 0;
  for (const item of play.bets) {
    if (play.winning.has(item)) {
      count++;
    }
  }
  return count;
}

function compute(plays, index, cache) {
  if (index in cache) {
    return cache[index];
  }
  let result = getWins(plays[index]);
  if (result > 0) {
    for (let i = index + 1, max = i + result, len = plays.length; i < max && i < len; i++) {
      result += compute(plays, i, cache);
    }
  }
  cache[index] = result;
  return result;
}

function solution2(input) {
  const result = parseInputs(input), cache = [];
  let sum = 0;
  for (let i = 0, len = result.length; i < len; i++) {
    sum += compute(result, i, cache);
  }
  return sum + result.length;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(await solution2(result));
