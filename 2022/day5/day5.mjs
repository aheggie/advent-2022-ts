import { readFileSync } from "node:fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const [rawStackData, rawInstructionData] = readFileSync(
  `./data/${arg}.txt`,
  "utf8"
)
  .trim()
  // different newlines because test is copy-pasted from problem_statement while
  // input is auto-generated
  .split(arg === "test" ? "\r\n\r\n" : "\n\n");

//   somehow line1 of the test stack brteaks here but not the input one???

const stackArr = rawStackData.trim().split(arg === "test" ? "\r\n" : "\n");

const stackDiagram = stackArr.slice(0, stackArr.length - 1);
const numStacks =
  // take the last item of the stack array which is a string of stackId numbers
  stackArr[stackArr.length - 1]
    // take the very last character, the id number of the last stack
    .slice(-1);

const cleanedStackData = stackDiagram.map((stackLayer) =>
  stackLayer.split("").filter((_, index) => index % 4 === 1)
);

const arrOfStacks = cleanedStackData
  .reduce(
    (acc, cur) => cur.map((item, index) => acc[index].concat([item])),
    [...new Array(cleanedStackData[0].length)].map(() => [])
  )
  .map((stack) => stack.filter((stackItem) => stackItem !== " "));

const cleanedInstructionData = rawInstructionData
  .trim()
  .split("\n")
  .map((instructionStr) => {
    const instructionArr = instructionStr.trim().split(" ");
    return {
      amountMoved: parseInt(instructionArr[1], 10),
      // zero index
      fromStack: parseInt(instructionArr[3], 10) - 1,
      toStack: parseInt(instructionArr[5], 10) - 1,
    };
  });

const movedStacksQ1 = cleanedInstructionData.reduce(
  (acc, { amountMoved, fromStack, toStack }) => {
    const transfer = acc[fromStack].slice(0, amountMoved);
    const newFromStack = acc[fromStack].slice(amountMoved);
    const newToStack = transfer.reverse().concat(acc[toStack]);
    // uncertain of this
    acc[fromStack] = newFromStack;
    acc[toStack] = newToStack;
    return acc;
  },
  arrOfStacks
);

const processedDataQ1 = movedStacksQ1.map((stack) => stack[0]).join("");

const movedStacksQ2 = cleanedInstructionData.reduce(
  (acc, { amountMoved, fromStack, toStack }) => {
    const transfer = acc[fromStack].slice(0, amountMoved);
    const newFromStack = acc[fromStack].slice(amountMoved);
    const newToStack = transfer.reverse().concat(acc[toStack]);
    // uncertain of this
    acc[fromStack] = newFromStack;
    acc[toStack] = newToStack;
    return acc;
  },
  arrOfStacks
);

const processedDataQ2 = movedStacksQ1.map((stack) => stack[0]).join("");

console.dir(
  {
    arrOfStacks,
    cleanedInstructionData,
    processedDataQ1,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
