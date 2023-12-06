import fs from 'fs/promises';

const test1 = `Time:      7  15   30
Distance:  9  40  200`;

function parseInputs(input) {
  const [time, distance] = input.split('\n');
  const [, timeValues] = time.split(/:\s+/);
  const [, distanceValues] = distance.split(/:\s+/);

  return {
    time: timeValues.split(/\s+/).map((k) => +k),
    distance: distanceValues.split(/\s+/).map((k) => +k)
  }
}

function computeSpeed(value, cap) {
  return (cap - value) * value;
}

function getRecords(time, distance) {
  let ways = 0;
  for (let i = 0; i < time; i++) {
    const speed = computeSpeed(i, time);
    if (speed > distance) {
      ways++;
    }
  }
  return ways || 1;
}

function solution1(input) {
  const { time, distance } = parseInputs(input);

  let prod = 1;
  for (let i = 0, len = time.length; i < len; i++) {
    const result = getRecords(time[i], distance[i]);
    prod *= result;
  }
  return prod
}


function solution2(input) {
  const { time, distance } = parseInputs(input);

  return getRecords(+(time.join('')), +(distance.join('')))
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));