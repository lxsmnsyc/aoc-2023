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

const test5 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

function parseInput(input) {
  const map = input.split('\n').map((line) => line.split(''));
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

function expand(grid) {
  const newMap = [...new Array(grid.maxY * 3)].map(() => new Array(grid.maxX * 3).fill('.'));
  const newGrid = {
    maxX: grid.maxX * 3,
    maxY: grid.maxY * 3,
    map: newMap,
    flagged: new Set(),
  };

  for (let x = 0; x < grid.maxX; x++) {
    for (let y = 0; y < grid.maxY; y++) {
      const newX = x * 3 + 1;
      const newY = y * 3 + 1;
      const current = grid.map[y][x];

      if (current === '.') {
        newGrid.flagged.add(`${newX},${newY}`);
      }

      newMap[newY][newX] = current;
      
      switch (current) {
        case 'S':
          if (isValidStep(grid, x, y + 1, ['L', 'J', '|'])) {
            newMap[newY + 1][newX] = '|';
          }
          if (isValidStep(grid, x, y - 1, ['F', '7', '|'])) {
            newMap[newY - 1][newX] = '|';
          }
          if (isValidStep(grid, x + 1, y, ['7', 'J', '-'])) {
            newMap[newY][newX + 1] = '-';
          }
          if (isValidStep(grid, x - 1, y, ['L', 'F', '-'])) {
            newMap[newY][newX - 1] = '-';
          }
          break;
        case 'F':
          if (isValidCoords(newGrid, newX + 1, newY)) {
            newMap[newY][newX + 1] = '-';
          }
          if (isValidCoords(newGrid, newX, newY + 1)) {
            newMap[newY + 1][newX] = '|';
          }
          break;
        case '7':
          if (isValidCoords(newGrid, newX - 1, newY)) {
            newMap[newY][newX - 1] = '-';
          }
          if (isValidCoords(newGrid, newX, newY + 1)) {
            newMap[newY + 1][newX] = '|';
          }
          break;
        case 'L':
          if (isValidCoords(newGrid, newX + 1, newY)) {
            newMap[newY][newX + 1] = '-';
          }
          if (isValidCoords(newGrid, newX, newY - 1)) {
            newMap[newY - 1][newX] = '|';
          }
          break;
        case 'J':
          if (isValidCoords(newGrid, newX - 1, newY)) {
            newMap[newY][newX - 1] = '-';
          }
          if (isValidCoords(newGrid, newX, newY - 1)) {
            newMap[newY - 1][newX] = '|';
          }
          break;
        case '-': 
          if (isValidCoords(newGrid, newX - 1, newY)) {
            newMap[newY][newX - 1] = '-';
          }
          if (isValidCoords(newGrid, newX + 1, newY)) {
            newMap[newY][newX + 1] = '-';
          }
          break;
        case '|':
          if (isValidCoords(newGrid, newX, newY - 1)) {
            newMap[newY - 1][newX] = '|';
          }
          if (isValidCoords(newGrid, newX, newY + 1)) {
            newMap[newY + 1][newX] = '|';
          }
          break;
      }
    }
  }
  return newGrid;
}

function reach(grid) {
  const queue = [locate(grid)];
  const visited = new Set();

  while (queue.length) {
    const current = queue.shift();
    
    if (
      isValidCoords(grid, current.x, current.y)
      && !visited.has(`${current.x},${current.y}`)
    ) {
      visited.add(`${current.x},${current.y}`);
      const char = grid.map[current.y][current.x];
  
      switch (char) {
        case 'S':
          if (isValidStep(grid, current.x, current.y + 1, ['L', 'J', '|'])) {
            queue.push({ x: current.x, y: current.y + 1});
          }
          if (isValidStep(grid, current.x, current.y - 1, ['F', '7', '|'])) {
            queue.push({ x: current.x, y: current.y - 1});
          }
          if (isValidStep(grid, current.x + 1, current.y, ['7', 'J', '-'])) {
            queue.push({ x: current.x + 1, y: current.y});
          }
          if (isValidStep(grid, current.x - 1, current.y, ['L', 'F', '-'])) {
            queue.push({ x: current.x - 1, y: current.y});
          }
          break;
        case 'F':
          queue.push({ x: current.x + 1, y: current.y});
          queue.push({ x: current.x, y: current.y + 1});
          break;
        case '7':
          queue.push({ x: current.x - 1, y: current.y});
          queue.push({ x: current.x, y: current.y + 1});
          break;
        case 'J':
          queue.push({ x: current.x - 1, y: current.y});
          queue.push({ x: current.x, y: current.y - 1});
          break;
        case 'L':
          queue.push({ x: current.x + 1, y: current.y});
          queue.push({ x: current.x, y: current.y - 1});
          break;
        case '|':
          queue.push({ x: current.x, y: current.y - 1});
          queue.push({ x: current.x, y: current.y + 1});
          break;
        case '-':
          queue.push({ x: current.x - 1, y: current.y});
          queue.push({ x: current.x + 1, y: current.y});
          break;
      }
    }
  }

  for (let x = 0; x < grid.maxX; x++) {
    for (let y = 0; y < grid.maxY; y++) {
      if (!visited.has(`${x},${y}`) && grid.map[y][x] !== '.') {
        grid.map[y][x] = '.';
      }
    }
  }
}

function flood(grid) {
  const queue = [
    { x: 0, y: 0 },
    { x: grid.maxX - 1, y: 0 },
    { x: 0, y: grid.maxY - 1 },
    { x: grid.maxX - 1, y: grid.maxY - 1 },
  ];
  const visited = new Set();
  while (queue.length) {
    const current = queue.shift();

    if (isValidCoords(grid, current.x, current.y)) {
      const char = grid.map[current.y][current.x];
  
      if (char === '.' && !visited.has(`${current.x},${current.y}`)) {
        visited.add(`${current.x},${current.y}`);
        grid.flagged.delete(`${current.x},${current.y}`);
        queue.push({ x: current.x, y: current.y - 1 });
        queue.push({ x: current.x, y: current.y + 1 });
        queue.push({ x: current.x - 1, y: current.y });
        queue.push({ x: current.x + 1, y: current.y });
      }
    }
  }

  return grid.flagged.size;
}

function plot(grid) {
  return grid.map.map((k) => k.join('')).join('\n');
}

function solution2(input) {
  const grid = parseInput(input);
  reach(grid);
  // console.log(plot(grid));
  const expanded = expand(grid);
  return flood(expanded);
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution2(result));
