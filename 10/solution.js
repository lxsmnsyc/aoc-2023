import fs from 'fs/promises';

const test1 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const test2 = `.....
.S-7.
.|.|.
.L-J.
.....`;

const test3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;

const test4 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

function parseInput(input) {
  const map = input.split('\n');
  return {
    map,
    maxX: map[0].length,
    maxY: map.length,
  };
}

function isValidCoords(grid, x, y) {
  return x < grid.maxX
  && y < grid.maxY
  && 0 <= x
  && 0 <= y
}

function isValidStep(grid, x, y, steps) {
  return isValidCoords(grid, x, y) && (console.log(steps, grid.map[y][x]), steps.includes(grid.map[y][x]));
}

function locate(grid) {
  for (let y = 0; y < grid.maxY; y++) {
    for (let x = 0; x < grid.maxX; x++) {
      const current = grid.map[y][x];
      if (current === 'S') {
        return { x, y };
      }
    }
  }
}

function traverse(grid, visited, start) {
  const queue = [{ ...start, start: true, step: 0 }];

  let max = 0;

  while (queue.length) {
    const current = queue.shift();
    
    if (
      isValidCoords(grid, current.x, current.y)
      && !visited.has(`${current.x},${current.y}`)
    ) {
      visited.add(`${current.x},${current.y}`);
      max = Math.max(current.step, max);
      const char = grid.map[current.y][current.x];
  
      switch (char) {
        case 'S':
          if (isValidStep(grid, current.x, current.y + 1, ['L', 'J', '|'])) {
            queue.push({ x: current.x, y: current.y + 1, step: current.step + 1});
          }
          if (isValidStep(grid, current.x, current.y - 1, ['F', '7', '|'])) {
            queue.push({ x: current.x, y: current.y - 1, step: current.step + 1});
          }
          if (isValidStep(grid, current.x + 1, current.y, ['7', 'J', '-'])) {
            queue.push({ x: current.x + 1, y: current.y, step: current.step + 1});
          }
          if (isValidStep(grid, current.x - 1, current.y, ['L', 'F', '-'])) {
            queue.push({ x: current.x - 1, y: current.y, step: current.step + 1});
          }
          break;
        case 'F':
          queue.push({ x: current.x + 1, y: current.y, step: current.step + 1});
          queue.push({ x: current.x, y: current.y + 1, step: current.step + 1});
          break;
        case '7':
          queue.push({ x: current.x - 1, y: current.y, step: current.step + 1});
          queue.push({ x: current.x, y: current.y + 1, step: current.step + 1});
          break;
        case 'J':
          queue.push({ x: current.x - 1, y: current.y, step: current.step + 1});
          queue.push({ x: current.x, y: current.y - 1, step: current.step + 1});
          break;
        case 'L':
          queue.push({ x: current.x + 1, y: current.y, step: current.step + 1});
          queue.push({ x: current.x, y: current.y - 1, step: current.step + 1});
          break;
        case '|':
          queue.push({ x: current.x, y: current.y - 1, step: current.step + 1});
          queue.push({ x: current.x, y: current.y + 1, step: current.step + 1});
          break;
        case '-':
          queue.push({ x: current.x - 1, y: current.y, step: current.step + 1});
          queue.push({ x: current.x + 1, y: current.y, step: current.step + 1});
          break;
      }
    }
  }
  return max;
}

function solution1(input) {
  const grid = parseInput(input);
  return traverse(
    grid,
    new Set(),
    locate(grid),
  );
}

function solution2(input) {
  const grid = parseInput(input);
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(test4));
