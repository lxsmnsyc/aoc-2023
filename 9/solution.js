import fs from 'fs/promises';

const test1 = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`;

function parseInputs(input) {
  return input.split('\n')
    .map((line) => line.split(/\s+/).map((k) => +k));
}

function isSame(line) {
  let base = line[0];
  let result = true;
  for (let i = 1, len = line.length; i < len; i++) {
    result &&= (base === line[i]);
    base = line[i];
  }
  return result;
}

function extrapolateLine(line) {
  let result = [];
  let base = line[0];
  for (let i = 1, len = line.length; i < len; i++) {
    result.push(line[i] - base);
    base = line[i];
  }
  return result;
}

function extrapolate(line) {
  const stack = [];
  while (!isSame(line)) {
    stack.push(line);
    line = extrapolateLine(line);
  }
  stack.push(line);
  return stack;
}

function solve1(extrapolated) {
  let inc = 0;
  for (let i = 0, len = extrapolated.length; i < len; i++) {
    const base = extrapolated[i];
    inc += base[base.length - 1];
  }
  return inc;
}

function solution1(input) {
  const lines = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const extrapolated = extrapolate(lines[i]).reverse();
    const solved = solve1(extrapolated);
    // console.log(i, solved);
    sum += solved;
  }
  return sum;
}

function solve2(extrapolated) {
  let inc = 0;
  for (let i = 0, len = extrapolated.length; i < len; i++) {
    const base = extrapolated[i];
    inc = base[0] - inc;
  }
  return inc;
}

function solution2(input) {
  const lines = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const extrapolated = extrapolate(lines[i]).reverse();
    const solved = solve2(extrapolated);
    sum += solved;
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
