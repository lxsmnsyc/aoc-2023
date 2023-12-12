import fs from 'fs/promises';

const test1 = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

function memoize(cb) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = cb.apply(null, args);
    cache.set(key, result);
    return result;
  };
}

const mutate = memoize((code, numbers, mode, target, current, index) => {
  if (index >= code.length) {
    if (target === numbers.length - 1) {
      const result = numbers[target] === current ? 1 : 0;
      return result;
    }
    const result = (target >= numbers.length && current === 0) ? 1 : 0;
    return result;
  }
  const char = code[index];
  let total = 0;
  if (char === '.' || char === '?') {
    if (mode === '#') {
      if (numbers[target] === current) {
        total += mutate(
          code,
          numbers,
          '.',
          target + 1,
          0,
          index + 1,
        );
      }
    } else {
      total += mutate(
        code,
        numbers,
        '.',
        target,
        0,
        index + 1,
      );
    }
  }
  if (char === '#' || char === '?') {
    total += mutate(
      code,
      numbers,
      '#',
      target,
      current + 1,
      index + 1,
    );
  }
  return total;
});

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
