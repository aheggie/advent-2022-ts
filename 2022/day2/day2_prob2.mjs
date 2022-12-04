import { readFileSync } from "node:fs";

const opponentChoiceLookup = { A: "Rock", B: "Paper", C: "Scissors" }; //makeRPSDecoder("A", "B", "C");
const goalLookup = { X: "Lose", Y: "Draw", Z: "Win" };

// if THEY play rock and I want to X what do I play
const makeOutcomeObj = (Win, Lose, Draw) => ({ Win, Lose, Draw });

const oppRockObj = makeOutcomeObj("Paper", "Scissors", "Rock");
const oppPaperObj = makeOutcomeObj("Scissors", "Rock", "Paper");

const oppScissorsObj = makeOutcomeObj("Rock", "Paper", "Scissors");

const choiceScoreLookup = { Rock: 1, Paper: 2, Scissors: 3 };
const outcomeScoreLookup = { Win: 6, Lose: 0, Draw: 3 };

const finalScore = readFileSync("./data/input.txt", "utf8")
  // clean white space
  .trim()
  // split into rounds
  .split("\n")
  // split the round into an array of two string choices
  .map((roundStr) => roundStr.split(" "))
  // process each array of two strings into an object with each choice
  .map((roundArr) => ({
    opp: opponentChoiceLookup[roundArr[0]],
    goal: goalLookup[roundArr[1]],
  }))
  // play out each game and return the score
  .map(({ opp, goal }) => {
    switch (opp) {
      case "Rock":
        return { choice: oppRockObj[goal], goal: goal };
      case "Paper":
        return { choice: oppScissorsObj[goal], goal: goal };
      case "Scissors":
        return { choice: oppScissorsObj[goal], goal: goal };
    }
  })
  // score each game
  .map(({ choice, goal }) => {
    return choiceScoreLookup[choice] + outcomeScoreLookup[goal];
  })
  // sum
  .reduce((acc, cur) => acc + cur);

console.dir(
  {
    finalScore,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
