import fs from 'fs/promises';

const test1 = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

function parseInput(input) {
  return input.split('\n');
}

function locate(map) {
  const galaxies = [];
  for (let y = 0, ylen = map.length; y < ylen; y++) {
    for (let x = 0, xlen = map[y].length; x < xlen; x++) {
      const current = map[y][x];
      if (current === '#') {
        galaxies.push({ x, y, prevX: x, prevY: y });
      }
    }
  }
  return {
    maxX: map[0].length,
    maxY: map.length,
    galaxies: galaxies.sort((a, b) => a.y - b.y)
  };
}

function adjust(grid, base, isX, multiplier) {
  for (let i = 0, len = grid.galaxies.length; i < len; i++) {
    const current = grid.galaxies[i];
    if (isX && current.prevX > base) {
      current.x += multiplier;
    }
    if (!isX && current.prevY > base) {
      current.y += multiplier;
    }
  }
  if (isX) {
    grid.maxX += multiplier;
  } else {
    grid.maxY += multiplier;
  }
}

function expand(grid, multiplier) {
  const xb = new Set();
  const yb = new Set();
  for (let i = 0, len = grid.galaxies.length; i < len; i++) {
    xb.add(grid.galaxies[i].x);
    yb.add(grid.galaxies[i].y);
  }
  for (let x = 0, len = grid.maxX; x < len; x++) {
    if (!xb.has(x)) {
      adjust(grid, x, true, multiplier);
    }
  }
  for (let y = 0, len = grid.maxY; y < len; y++) {
    if (!yb.has(y)) {
      adjust(grid, y, false, multiplier);
    }
  }
}

function plot(grid) {
  const map = [...new Array(grid.maxY)].map(() => [...new Array(grid.maxX).fill('.')]);
  console.log(grid.maxX, grid.maxY)
  for (let i = 0, len = grid.galaxies.length; i < len; i++) {
    const current = grid.galaxies[i];
    map[current.y][current.x] = '#';
  }
  return map.map((k) => k.join('')).join('\n');
}

function getTaxicab(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function solution1(input, multiplier = 2) {
  const map = parseInput(input);
  const grid = locate(map);
  expand(grid, multiplier - 1);

  // console.log(plot(grid));

  let sum = 0;

  for (let i = 0, len = grid.galaxies.length; i < len; i++) {
    for (let k = i + 1; k < len; k++) {
      const length = getTaxicab(grid.galaxies[i], grid.galaxies[k]);
      sum += length;
    }
  }
  return sum;
}

function solution2(input) {
  return solution1(input, 1000000);
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
