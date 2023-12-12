import fs from 'fs/promises';

const test1 = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

function replace(arr, index, item) {
  const rep = [...arr];
  rep[index] = item;
  return rep;
}

function mutate(code, numbers, mode, target, current, index) {
  if (index >= code.length) {
    if (target === numbers.length - 1) {
      const result = numbers[target] === current ? 1 : 0;
      return result;
    }
    const result = (target >= numbers.length && current === 0) ? 1 : 0;
    return result;
  }
  const char = code[index];
  if (char === '.') {
    if (mode === '#') {
      if (numbers[target] === current) {
        return mutate(
          code,
          numbers,
          '.',
          target + 1,
          0,
          index + 1,
        );
      }
      return 0;
    }
    return mutate(
      code,
      numbers,
      '.',
      target,
      0,
      index + 1,
    );
  }
  if (char === '#') {
    return mutate(
      code,
      numbers,
      '#',
      target,
      current + 1,
      index + 1,
    );
  }
  if (char === '?') {
    return mutate(
      replace(code, index, '#'),
      numbers,
      mode,
      target,
      current,
      index,
    ) + mutate(
      replace(code, index, '.'),
      numbers,
      mode,
      target,
      current,
      index,
    );
  }
  return 0;
}

function permute({ code, numbers }) {
  return mutate(
    code,
    numbers,
    null,
    0,
    0,
    0,
  );
}

function solve(lines) {
  let count = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const result = permute(lines[i]);
    console.log(lines[i].code.join(''), result);
    count += result;
  }
  return count;
}

function parseInputs(input) {
  return input.split('\n')
    .map((line) => {
      const [code, numbers] = line.split(' ');
      return {
        code: code.split(''),
        numbers: numbers.split(',').map((k) => +k)
      };
    });
}

function repeat(string, pattern, size) {
  let result = string;
  for (let i = 0; i < size; i++) {
    result += pattern + string;
  }
  return result;
}

function parseInputs2(input) {
  return input.split('\n')
    .map((line) => {
      const [code, numbers] = line.split(' ');
      return {
        code: repeat(code, '?', 4).split(''),
        numbers: repeat(numbers, ',', 4).split(',').map((k) => +k)
      };
    });
}

function solution1(input) {
  return solve(parseInputs(input));
}

function solution2(input) {
  return solve(parseInputs2(input));
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
