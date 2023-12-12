import fs from 'fs/promises';

const test1 = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

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

function isValid(code, numbers) {
  const splits = code.split(/\.+/).filter(Boolean);
  if (splits.length === numbers.length) {
    for (let i = 0, len = numbers.length; i < len; i++) {
      if (splits[i].length !== numbers[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

function mutate(code, numbers, current, index) {
  if (index >= code.length) {
    if (isValid(current, numbers)) {
      return 1;
    }
    return 0;
  }
  const char = code[index];
  if (char === '?') {
    return mutate(code, numbers, current + '#', index + 1) + mutate(code, numbers, current + '.', index + 1);
  }
  return mutate(code, numbers, current + char, index + 1);
}

function permute({ code, numbers }) {
  return mutate(code, numbers, [], 0);
}

function solution1(input) {
  const lines = parseInputs(input);

  let count = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const result = permute(lines[i]);
    console.log(lines[i].code.join(''), result);
    count += result;
  }
  return count;
}

function solution2(input) {
  const lines = parseInputs(input);

  let count = 0;
  for (let i = 0, len = lines.length; i < len; i++) {
    const current = lines[i];
    const result = permute({
      code: [
        ...current.code,
        '?',
        ...current.code,
        '?',
        ...current.code,
        '?',
        ...current.code,
        '?',
        ...current.code,
      ],
      numbers: [
        ...current.numbers,
        ...current.numbers,
        ...current.numbers,
        ...current.numbers,
        ...current.numbers,
      ],
    });
    console.log(lines[i].code.join(''), result);
    count += result;
  }
  return count;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution1(test1));
