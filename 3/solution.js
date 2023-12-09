import fs from 'fs/promises';

const test1 = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

function getLineAndColumn(input, start) {
  const result = input.substring(0, start).split('\n');
  return {
    line: result.length,
    column: result[result.length - 1].length,
  };
}

function tokenize(input) {
  let len = input.length, cursor = 0, numbers = [], symbols = [];

  while (cursor < len) {
    const current = input.substring(cursor);
    let inc = 1;

    if (/^[0-9]+/.test(current)) {
      const match = /^[0-9]+/.exec(current);
      if (match) {
        const result = match[0];
        const offset = result.length;
        numbers.push({
          value: result,
          ...getLineAndColumn(input, cursor),
        });
        inc = offset;
      }
    } else if (current[0] !== '.' && current[0] !== '\n') {
      symbols.push({
        type: 'symbol',
        value: current[0],
        ...getLineAndColumn(input, cursor),
      });
    }
    cursor += inc;
  }
  return { numbers, symbols };
}

function isAdjacentToSymbol(number, { line, column }) {
  const minX = number.column - 1;
  const minY = number.line - 1;
  const maxX = number.column + number.value.length;
  const maxY = number.line + 1;

  return minY <= line && line <= maxY && minX <= column && column <= maxX;
}
 
function isAdjacent(symbols, number) {
  for (let i = 0, len = symbols.length; i < len; i++) {
    if (isAdjacentToSymbol(number, symbols[i])) {
      return true;
    }
  }
  return false;
}

function solution1(input) {
  const { numbers, symbols } = tokenize(input);

  let sum = 0;

  for (let i = 0, len = numbers.length; i < len; i++) {
    if (isAdjacent(symbols, numbers[i])) {
      sum += +numbers[i].value;
    }
  }

  return sum;
}

function getDouble(numbers, symbol) {

  let found = false, prod = 0;

  for (let i = 0, len = numbers.length; i < len; i++) {
    const { value } = numbers[i];
    if (isAdjacentToSymbol(numbers[i], symbol)) {
      if (found) {
        return prod * +value;
      } else {
        found = true;
        prod = +value;
      }
    }
  }

  return 0;
}

function solution2(input) {
  const { numbers, symbols } = tokenize(input);

  let sum = 0;
  for (let i = 0, len = symbols.length; i < len; i++) {
    if (symbols[i].value === '*') {
      sum += getDouble(numbers, symbols[i]);
    }
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));