import { readFileSync } from "node:fs";

const opponentChoiceObj = { A: "Rock", B: "Paper", C: "Scissors" }; //makeRPSDecoder("A", "B", "C");
const goalObj = { X: "Lose", Y: "Draw", Z: "Win" };

// if THEY play rock and I want to X what do I play
const makeOutcomeObj = (Win, Lose, Draw) => ({ Win, Lose, Draw });

const oppRockObj = makeOutcomeObj("Paper", "Scissors", "Rock");
const oppPaperObj = makeOutcomeObj("Scissors", "Rock", "Paper");

const oppScissorsObj = makeOutcomeObj("Rock", "Paper", "Scissors");

const arrayOfRounds = readFileSync("./data/input.txt", "utf8")
  // clean white space
  .trim()
  // split into rounds
  .split("\n")
  // split the round into an array of two string choices
  .map((roundStr) => roundStr.split(" "))
  // process each array of two strings into an object with each choice
  .map((roundArr) => ({
    opp: processOpponent(roundArr[0]),
    goal: processSelf(roundArr[1]),
  }))
  // play out each game and return the score
  .map(playGame)
  // sum
  .reduce((acc, cur) => acc + cur);

console.dir(
  {
    arrayOfRounds,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
