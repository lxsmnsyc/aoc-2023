import fs from 'fs/promises';

function solution1(input) {
  let first, last, sum = 0;
  for (let i = 0, len = input.length; i < len; i++) {
    const current = input[i];
    if (current === '\n') {
      sum += +(first + last);
      first = '';
      last = '';
    } else if (current >= '0' && current <= '9') {
      if (first) {
        last = current;
      } else {
        first = current;
        last = current;
      }
    }
  } 
  sum += +(first + last);
  first = '';
  last = '';
  return sum;
}

const DIGITS = /^[0-9]/;
const WORDS = /^(one|two|three|four|five|six|seven|eight|nine)/;

const dictionary = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};

function tokenize(input) {
  const tokens = [];
  let len = input.length, cursor = 0;
  while (cursor < len) {
    const current = input.substring(cursor);
    if (DIGITS.test(current)) {
      tokens.push(current[0]);
      cursor++;
    } else if (WORDS.test(current)) {
      const match = WORDS.exec(current);
      if (match) {
        const result = dictionary[match[0]];
        tokens.push(result);
        cursor += result.length;
      } else {
        cursor++;
      }
    } else if (current[0] === '\n') {
      tokens.push('\n');
      cursor++;
    } else {
      cursor++;
    }
  }
  return tokens;
}

function solution2(input) {
  const tokens = tokenize(input);
  return solution1(tokens);
}

const result = await fs.readFile('./inputs.txt', 'utf-8');
const test1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;
const test2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;
console.log(await solution2(result));