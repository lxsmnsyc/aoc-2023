import fs from 'fs/promises';

const test1 = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`

function parseSeeds(seeds) {
  return seeds.split(': ')[1].split(' ').map((k) => +k);
}

function parseRow(row) {
  const [destination, source, length] = row.split(' ');
  return {
    destination: +destination,
    source: +source,
    length: +length,
  };
}

function parseGrid(grid) {
  const rows = grid.split('\n');
  const result = [];
  for (let i = 0, len = rows.length; i < len; i++) {
    result.push(parseRow(rows[i]));
  }
  return result;
}

function parseMap(map) {
  const [transition, grid] = map.split(' map:\n');
  return {
    transition,
    grid: parseGrid(grid),
  };
}

function parseMaps(maps) {
  const result = [];
  for (let i = 0, len = maps.length; i < len; i++) {
    result.push(parseMap(maps[i]));
  }
  return result;
}

function parseInputs(input) {
  const [seeds, ...maps] = input.split('\n\n'); 

  return {
    seeds: parseSeeds(seeds),
    maps: parseMaps(maps),
  };
}

function solveSeedForRow(seed, { destination, source, length }) {
  if (source <= seed && seed < source + length) {
    return destination + (seed - source);
  }
  return undefined;
}

function solveSeedForMap(seed, map) {
  for (let i = 0, len = map.grid.length; i < len; i++) {
    const result = solveSeedForRow(seed, map.grid[i]);
    if (result != null) {
      return result;
    }
  }
  return seed;
}

function solveSeed(seed, maps) {
  for (let i = 0, len = maps.length; i < len; i++) {
    seed = solveSeedForMap(seed, maps[i]);
  }
  return seed;
}

function solution1(input) {
  const { seeds, maps } = parseInputs(input);
  let min = Number.MAX_SAFE_INTEGER;
  for (let i = 0, len = seeds.length; i < len; i++) {
    min = Math.min(min, solveSeed(seeds[i], maps));
  }
  return min;
}

function doesIntersect([x1, x2], [y1, y2]) {
  return x1 <= y2 && y1 <= x2;
}

function intersectPairs(pairs) {
  let merged = false;
  const newPairs = [];
  for (let i = 0, len = pairs.length; i < len; i++) {
    const source = pairs[i];
    if (source) {
      for (let k = 0; k < len; k++) {
        const target = pairs[k];
        if (target && source !== target && doesIntersect(source, target)) {
          // absorb
          merged = true;
          newPairs.push([
            Math.min(source[0], target[0]),
            Math.max(source[1], target[1]),
          ]);
          pairs[i] = undefined;
          pairs[k] = undefined;
        }
      }
    }
  }
  for (let i = 0, len = pairs.length; i < len; i++) {
    if (pairs[i]) {
      newPairs.push(pairs[i]);
    }
  }
  if (merged) {
    return intersectPairs(newPairs);
  }
  return pairs;
}

function resolveSeeds(seeds) {
  // transform to pairs
  const pairs = [];
  for (let i = 0, len = seeds.length; i < len; i += 2) {
    pairs.push([seeds[i], seeds[i] + seeds[i + 1]]);
  }
  return intersectPairs(pairs);
}

function solution2(input) {
  const { seeds, maps } = parseInputs(input);

  let result = Number.MAX_SAFE_INTEGER;
  const pairs = resolveSeeds(seeds);
  for (let i = 0, len = pairs.length; i < len; i++) {
    const [min, max] = pairs[i];
    for (let k = min; k < max; k++) {
      result = Math.min(result, solveSeed(k, maps));
    }
  }
  return result;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(await solution2(result));
