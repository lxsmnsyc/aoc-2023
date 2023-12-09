import fs from 'fs/promises';

const test1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const test2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`

const test3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

function parseMap(map) {
  return Object.fromEntries(map
    .split('\n')
    .map((line) => {
      const [key, nodes] = line.split(' = ');
      const [left, right] = nodes.split(', ');

      return [key, { L: left.substring(1), R: right.substring(0, 3)}];
    }));
}

function parseInputs(input) {
  const [steps, map] = input.split('\n\n');
  return { steps, map: parseMap(map) };
}

function count(
  { steps, map },
  start,
  done,
) {
  let count = 0;
  let index = 0;

  while (done(start)) {
    if (index === steps.length) {
      index = 0;
    }
    const step = steps[index++];
    count++;
    start = map[start][step];
  }
  return count;
}

function solution1(input) {
  return count(
    parseInputs(input),
    'AAA',
    (current) => current !== 'ZZZ',
  )
}

function gcd(a, b) {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
} 

function solution2(input) {
  const parsed = parseInputs(input);
  const start = Object.keys(parsed.map).filter((key) => key.endsWith('A'));
  const targets = [];
  for (let i = 0, len = start.length; i < len; i++) {
    targets[i] = count(
      parsed,
      start[i],
      (current) => !current.endsWith('Z'),
    );
  }
  let result = targets[0];
  for (let i = 1, len = targets.length; i < len; i++) {
    result = lcm(result, targets[i]);
  }
  return result;
}


const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
