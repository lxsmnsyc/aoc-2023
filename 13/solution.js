import fs from 'fs/promises';

const test1 = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

function parseInputs(input) {
  return input.split('\n\n').map((pattern) => pattern.split('\n'));
}

function isReflection(pattern, target) {
  const left = pattern.slice(0, target).reverse();
  const right = pattern.slice(target);

  const len = Math.min(left.length, right.length);

  for (let i = 0; i < len; i++) {
    if (left[i] !== right[i]) {
      return false;
    }
  }
  return true;
}

function measure(pattern) {
  let prev = pattern[0];
  for (let i = 1, len = pattern.length; i < len; i++) {
    const next = pattern[i];
    if (prev === next && isReflection(pattern, i)) {
      return i;
    }
    prev = next;
  }
  return 0;
}

function rotatePattern(pattern) {
  const newPattern = [];
  for (let i = 0, len = pattern.length; i < len; i++) {
    for (let k = 0, klen = pattern[i].length; k < klen; k++) {
      const target = k;
      newPattern[target] = pattern[i][k] + (newPattern[target] || '');
    }
  }
  // console.log(newPattern.join('\n'))
  // console.log('')
  return newPattern;
}

function solution1(input) {
  const patterns = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = patterns.length; i < len; i++) {
    sum += (measure(patterns[i]) * 100) + measure(rotatePattern(patterns[i]));
  }
  return sum;
}

function hasSmudge(left, right) {
  const len = Math.min(left.length, right.length);
  let found = false;
  for (let i = 0; i < len; i++) {
    if (left[i] !== right[i]) {
      if (found) {
        return false;
      }
      found = true;
    }
  }
  return found;
}

function isReflection2(pattern, target) {
  const left = pattern.slice(0, target).reverse();
  const right = pattern.slice(target);

  const len = Math.min(left.length, right.length);

  let checkForSmudge = true;

  for (let i = 0; i < len; i++) {
    if (left[i] !== right[i]) {
      if (checkForSmudge) {
        const result = hasSmudge(left[i], right[i]);
        if (!result) {
          return false;
        }
        checkForSmudge = false;
      } else {
        return false;
      }
    }
  }
  if (!checkForSmudge) {
    return true;
  }
  return false;
}

function measure2(pattern) {
  let record = 0;
  for (let i = 1, len = pattern.length; i < len; i++) {
    if (isReflection2(pattern, i)) {
      return i;
    }
  }
  return record;
}

function solution2(input) {
  const patterns = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = patterns.length; i < len; i++) {
    const row = measure2(patterns[i]);
    if (row) {
      console.log(i, 'horizontal', row);
      console.log('');
      sum += row * 100;
    } else {
      const col = measure2(rotatePattern(patterns[i]));
      console.log(i, 'vertical', col);
      console.log('');
      sum += col;
    }
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
