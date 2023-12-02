import fs from 'fs/promises';

const test1 = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

function parseTurn(turn) {
  const cubes = turn.split(', ');
  const output = [];
  for (let i = 0, len = cubes.length; i < len; i++) {
    output.push(cubes[i].split(' '));
  }
  return output;
}

function parseTurns(turns) {
  const output = [];
  for (let i = 0, len = turns.length; i < len; i++) {
    output.push(parseTurn(turns[i]));
  }
  return output;
}

function parseInputs(input) {
  const lines = input.split('\n');
  // parse the line
  const games = [];
  for (let i = 0, len = lines.length; i < len; i++) {
    const [game, plays] = lines[i].split(': ');
    games.push({
      game: game.split('Game ')[1],
      turns: parseTurns(plays.split('; ')),
    })
  }
  return games;
}

const cap = {
  red: 12,
  green: 13,
  blue: 14,
}

function isTurnImpossible(turn) {
  for (let i = 0, len = turn.length; i < len; i++) {
    const [amount, color] = turn[i];
    if (+amount > cap[color]) {
      return true;
    }
  }
  return false;
}

function isImpossible(turns) {
  for (let i = 0, len = turns.length; i < len; i++) {
    if (isTurnImpossible(turns[i])) {
      return true;
    }
  }
  return false;
}

function solution1(input) {
  const games = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = games.length; i < len; i++) {
    if (!isImpossible(games[i].turns)) {
      sum += +games[i].game;
    }
  }
  return sum;
}

function updateCap(caps, turn) {
  for (let i = 0, len = turn.length; i < len; i++) {
    const [amount, color] = turn[i];
    if (+amount > caps[color]) {
      caps[color] = +amount;
    }
  }
}

function getMinimal(turns) {
  const caps = { red: 0, green: 0, blue: 0 };
  for (let i = 0, len = turns.length; i < len; i++) {
    updateCap(caps, turns[i]);
  }
  return caps;
}

function solution2(input) {
  const games = parseInputs(input);
  let sum = 0;
  for (let i = 0, len = games.length; i < len; i++) {
    const result = getMinimal(games[i].turns);
    sum += result.red * result.green * result.blue;
  }
  return sum;
}

const result = await fs.readFile('./inputs.txt', 'utf-8');

console.log(await solution2(result));