import fs from 'fs/promises';

const test1 = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

function parseInputs(input) {
  return input.split(',');
}

function computeHash(str) {
  let current = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const char = str.charCodeAt(i);
    current = ((current + char) * 17) % 256;
  }
  return current;
}

function solution1(input) {
  const ins = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = ins.length; i < len; i++) {
    sum += computeHash(ins[i]);
  }
  return sum;
}

function solution2(input) {
  const ins = parseInputs(input);
  const keys = new Map;
  for (let i = 0, len = ins.length; i < len; i++) {
    const current = ins[i];

    if (current.includes('-')) {
      const target = current.split('-')[0];
      if (keys.has(target)) {
        keys.delete(target); 
      }
    } else {
      const [key, value] = current.split('=');
      const box = computeHash(key);
      keys.set(key, {
        box,
        value: +value, 
      });
    }
  }
  console.log(keys);
  const slots = [];
  for (const [key, value] of keys) {
    (slots[value.box] ||= []).push(key);
  }
  let sum = 0;
  for (const [key, { box, value }] of keys) {
    sum += ((box + 1) * (slots[box].indexOf(key) + 1) * value);
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
