import { readFileSync } from "fs";

const makeRPSDecoder =
  (RockEncode: string, PaperEncode: string, ScissorsEncode: string) =>
  (opponentChoice: string): string => {
    switch (opponentChoice) {
      case RockEncode:
        return "Rock";
      case PaperEncode:
        return "Paper";
      case ScissorsEncode:
        return "Scissors";
      default:
        throw new Error("Invalid opponent choice");
    }
  };

const processOpponent = makeRPSDecoder("A", "B", "C");
const processSelf = makeRPSDecoder("X", "Y", "Z");

const singleRPSRound =
  (selfChoice: string, winsAgaints: string, losesAgainst: string) =>
  (oppChoice: string): 0 | 3 | 6 => {
    switch (oppChoice) {
      // if we lose against the opponent's choice
      case losesAgainst:
        return 0;
      // if we chose the same thing as the opponent - a tie
      case selfChoice:
        return 3;
      // if we win against the opponent
      case winsAgaints:
        return 6;
      // this should be unreachable
      default:
        throw new Error("error in constrcting game");
    }
  };

const rockRound = singleRPSRound("Rock", "Scissors", "Paper");
const paperRound = singleRPSRound("Paper", "Rock", "Scissors");
const scissorsRound = singleRPSRound("Scissors", "Paper", "Rock");

const playGame = ({ opp, self }): number => {
  const choiceScore =
    self === "Rock"
      ? 1
      : self === "Paper"
      ? 2
      : // defalut value for self equals "Scissors"
        3;
  switch (self) {
    case "Rock":
      return rockRound(opp) + choiceScore;
    case "Paper":
      return paperRound(opp) + choiceScore;
    case "Scissors":
      return scissorsRound(opp) + choiceScore;
    // this should be unreachable
    default:
      throw new Error("problem executing game");
  }
};

const sumOfRounds = readFileSync("./data/input.txt", "utf8")
  // clean white space
  .trim()
  // split into rounds
  .split("\n")
  // split the round into an array of two string choices
  .map((roundStr) => roundStr.split(" "))
  // process each array of two strings into an object with each choice
  .map((roundArr) => ({
    opp: processOpponent(roundArr[0]),
    self: processSelf(roundArr[1]),
  }))
  // play out each game and return the score
  .map(playGame)
  // sum
  .reduce((acc, cur) => acc + cur);

console.dir(
  {
    sumOfRounds,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
