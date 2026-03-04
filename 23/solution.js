import fs from 'fs/promises';

const test1 = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

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

function parseInputs(input) {
  const grid = input.split('\n').map((y) => y.split(''));

  return {
    maxY: grid.length,
    maxX: grid[0].length,
    grid,
  };
}

function locateStartPoint(map) {
  for (let y = 0; y < map.maxY; y++) {
    for (let x = 0; x < map.maxX; x++) {
      if (map.grid[y][x] === 'S') {
        map.grid[y][x] = 'O';
      }
    }
  }
}

function patch1(map, cloned, x, y) {
  if (y >= 0 && y < map.maxY && x >= 0 && x <= map.maxX && map.grid[y][x] === '.') {
    cloned.grid[y][x] = 'O';
  }
}

const step1 = memoize((map) => {
  const cloned = JSON.parse(JSON.stringify(map));
  for (let y = 0; y < map.maxY; y++) {
    for (let x = 0; x < map.maxX; x++) {
      if (map.grid[y][x] === 'O') {
        cloned.grid[y][x] = '.';
        patch1(map, cloned, x - 1, y);
        patch1(map, cloned, x + 1, y);
        patch1(map, cloned, x, y - 1);
        patch1(map, cloned, x, y + 1);
      }
    }
  }
  return cloned;
});

function count(map) {
  let count = 0;
  for (let y = 0; y < map.maxY; y++) {
    for (let x = 0; x < map.maxX; x++) {
      if (map.grid[y][x] === 'O') {
        count++
      }
    }
  }
  return count;
}

function solution1(input, cycles) {
  const map = parseInputs(input);
  locateStartPoint(map);
  let current = map;
  for (let i = 0; i < cycles; i++) {
    current = step1(current);
  }
  // console.log(current.grid.map((y) => y.join('')).join('\n'));
  return count(current);
}

function createTemplate(map) {
  const cloned = JSON.parse(JSON.stringify(map.grid));
  for (let y = 0; y < map.maxY; y++) {
    for (let x = 0; x < map.maxX; x++) {
      if (cloned[y][x] === 'S') {
        cloned[y][x] = '.';
      }
    }
  }
  return cloned;
}

function patch2(maps, template, map, cloned, x, y) {
  if (y >= 0 && y < map.maxY && x >= 0 && x <= map.maxX) {
    if (map.grid[y][x] === '.') {
      cloned[y][x] = 'O';
    }
  } else {
    console.log('BEFORE', x, y, map.maxX, map.maxY)
    if (y < 0) {
      y = map.maxY + y;
    } else if (y >= map.maxY) {
      y = y - map.maxY;
    }
    if (x < 0) {
      x = map.maxX + x;
    } else if (x >= map.maxX) {
      x = x - map.maxX;
    }

    const clonedTemplate = JSON.parse(JSON.stringify(template));
    console.log('AFTER', x, y, map.maxX, map.maxY)
    clonedTemplate[y][x] = 'O';
    maps.push({
      ...map,
      grid: clonedTemplate,
    });
  }
}

const step2 = (maps, template, map) => {
  const cloned = JSON.parse(JSON.stringify(map.grid));
  for (let y = 0; y < map.maxY; y++) {
    for (let x = 0; x < map.maxX; x++) {
      if (map.grid[y][x] === 'O') {
        cloned[y][x] = '.';
        patch2(maps, template, map, cloned, x - 1, y);
        patch2(maps, template, map, cloned, x + 1, y);
        patch2(maps, template, map, cloned, x, y - 1);
        patch2(maps, template, map, cloned, x, y + 1);
      }
    }
  }
  map.grid = cloned;
};

function solution2(input, cycles) {
  const map = parseInputs(input);
  locateStartPoint(map);
  const template = createTemplate(map);
  const maps = [map];
  for (let i = 0; i < cycles; i++) {
    for (const current of [...maps]) {
      step2(maps, template, current);
    }
  }
  // console.log(current.grid.map((y) => y.join('')).join('\n'));
  return maps.reduce((acc, current) => acc + count(current), 0) ;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(solution1(result, 64)); // part 1
console.log(solution2(test1, 10)); // part 1
// console.log(solution2(result, 26501365)); // part 2
