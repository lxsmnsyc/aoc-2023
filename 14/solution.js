import fs from 'fs/promises';

const test1 = `OOOO.#.O..
OO..#....#
OO..O##..O
O..#.OO...
........#.
..#....#.#
..O..#.O.O
..O.......
#....###..
#....#....`;

function parseInputs(input) {
  return input.split('\n').map((line) => line.split(''));
}

function shiftTile(map, x, y) {
  while (y > 0) {
    const current = map[y][x];
    const next = map[y - 1][x];
    if (next === '.') {
      map[y - 1][x] = current;
      map[y][x] = next;
      y--;
    } else {
      break;
    }
  }
  return map.length - y;
} 

function tilt(map) {
  let sum = 0;
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    const line = map[y];
    for (let x = 0, xlen = line.length; x < xlen; x++) {
      const tile = line[x];
      if (tile === 'O') {
        sum += shiftTile(map, x, y)
      }
    }
  }
  return sum;
}

function solution1(input) {
  const map = parseInputs(input);
  return tilt(map);
}

function shiftNorth(map, x, y) {
  while (y > 0) {
    const current = map[y][x];
    const next = map[y - 1][x];
    if (next === '.') {
      map[y - 1][x] = current;
      map[y][x] = next;
      y--;
    } else {
      break;
    }
  }
}

function tiltNorth(map) {
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    const line = map[y];
    for (let x = 0, xlen = line.length; x < xlen; x++) {
      const tile = line[x];
      if (tile === 'O') {
        shiftNorth(map, x, y)
      }
    }
  }
}

function shiftWest(map, x, y) {
  while (x > 0) {
    const current = map[y][x];
    const next = map[y][x - 1];
    if (next === '.') {
      map[y][x - 1] = current;
      map[y][x] = next;
      x--;
    } else {
      break;
    }
  }
}

function tiltWest(map) {
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    const line = map[y];
    for (let x = 0, xlen = line.length; x < xlen; x++) {
      const tile = line[x];
      if (tile === 'O') {
        shiftWest(map, x, y)
      }
    }
  }
}

function shiftSouth(map, x, y) {
  while (y < map.length - 1) {
    const current = map[y][x];
    const next = map[y + 1][x];
    if (next === '.') {
      map[y + 1][x] = current;
      map[y][x] = next;
      y++;
    } else {
      break;
    }
  }
}

function tiltSouth(map) {
  for (let ylen = map.length, y = ylen - 1; y >= 0; y--) {
    const line = map[y];
    for (let x = 0, xlen = line.length; x < xlen; x++) {
      const tile = line[x];
      if (tile === 'O') {
        shiftSouth(map, x, y)
      }
    }
  }
}

function shiftEast(map, x, y) {
  while (x < map[0].length - 1) {
    const current = map[y][x];
    const next = map[y][x + 1];
    if (next === '.') {
      map[y][x + 1] = current;
      map[y][x] = next;
      x++;
    } else {
      break;
    }
  }
}

function tiltEast(map) {
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    const line = map[y];
    for (let xlen = line.length, x = xlen - 1; x >= 0; x--) {
      const tile = line[x];
      if (tile === 'O') {
        shiftEast(map, x, y)
      }
    }
  }
}

function computeLoad(map) {
  let sum = 0;
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    const line = map[y];
    for (let x = 0, xlen = line.length; x < xlen; x++) {
      const tile = line[x];
      if (tile === 'O') {
        sum += ylen - y;
      }
    }
  }
  return sum;
}

function clone(map) {
  return JSON.parse(JSON.stringify(map));
}

function solution2(input) {
  const map = parseInputs(input);
  const seen = new Map();
  const maps = [];
  for (let i = 0; i < 1e9; i++) {
    const hash = JSON.stringify(map);
    maps[i] = clone(map);
    if (seen.has(hash)) {
      const base = seen.get(hash);
      const target = i - base;
      const remaining = 1e9 - base;
      return computeLoad(maps[base + remaining % target]);
    }
    seen.set(hash, i);
    tiltNorth(map);
    tiltWest(map);
    tiltSouth(map);
    tiltEast(map);
  }
  return computeLoad(map);
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
