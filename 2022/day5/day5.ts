import { readFileSync } from "fs";
import { ReadableStreamDefaultController } from "node:stream/web";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

// above two newlines is the stack diagram, below two newlines is the instruction set
const [rawStackData, rawInstructionData]: string[] = readFileSync(
  `./data/${arg}.txt`,
  "utf8"
)
  .trim()
  // different newlines because test is copy-pasted from problem_statement while
  // input is auto-generated
  .split(arg === "test" ? "\r\n\r\n" : "\n\n");

type Stack = string[];

interface StackInstruction {
  amountMoved: number;
  fromStack: number;
  toStack: number;
}

const arrOfStacks: string[][] = rawStackData
  // defensive trim of any whitespace before split
  .trim()
  // each layer of the stackdiagram becomes an element of an array
  .split(arg === "test" ? "\r\n" : "\n")
  // the last element of the stack diagram is a label that we can drop
  .slice(0, -1)
  // here we map from and array stack layer strings(including decorative characters) to
  // an array of stack layer data arrays
  .map((stackLayer: string): string[] =>
    // start with the full stack layer as a string
    stackLayer
      // split to get an array of each character
      .split("")
      // starting with the second character, there is a data character
      // at every fourth character further along
      // so at index 1,5,9, etc. - we only keep data now
      // note: because our data is still vertical
      // we DO consider an empty stack element as data, unline decorative whitespace
      .filter((_, index) => index % 4 === 1)
  )
  // have an array of stack layer data arrays
  // we want to get an array of stacks
  // to do this we'll need to turn our vertical data horizontal
  .reduce(
    (acc: string[][], cur: string[]): string[][] =>
      cur.map((item, index) => {
        if (typeof acc[index] === "undefined") {
          return [item];
        } else {
          return acc[index].concat(item);
        }
      }),
    <string[][]>[]
  )
  .map((stack) => stack.filter((stackItem) => stackItem !== " "));

const cleanedInstructionData: StackInstruction[] = rawInstructionData
  .trim()
  .split("\n")
  .map((instructionStr: string): StackInstruction => {
    const instructionArr = instructionStr.trim().split(" ");
    return {
      amountMoved: parseInt(instructionArr[1], 10),
      // zero index
      fromStack: parseInt(instructionArr[3], 10) - 1,
      toStack: parseInt(instructionArr[5], 10) - 1,
    };
  });

const movedStacksQ1: string[][] = cleanedInstructionData.reduce(
  (
    acc: string[][],
    { amountMoved, fromStack, toStack }: StackInstruction,
    currentIndex: number
  ): string[][] => {
    if (currentIndex === 0) {
      console.log("Q1", acc);
    }
    const transfer = acc[fromStack].slice(0, amountMoved);
    const newFromStack = acc[fromStack].slice(amountMoved);
    const newToStack = transfer.reverse().concat(acc[toStack]);
    // uncertain of this
    acc[fromStack] = newFromStack;
    acc[toStack] = newToStack;
    return acc;
  },
  //   so we never alter the original data in place
  arrOfStacks.slice(0)
);

const processedDataQ1: string = movedStacksQ1.map((stack) => stack[0]).join("");

const movedStacksQ2: string[][] = cleanedInstructionData.reduce(
  (
    acc: string[][],
    { amountMoved, fromStack, toStack }: StackInstruction,
    currentIndex: number
  ): string[][] => {
    if (currentIndex === 0) {
      console.log("Q2", acc);
    }
    const transfer = acc[fromStack].slice(0, amountMoved);
    const newFromStack = acc[fromStack].slice(amountMoved);
    // just dont reverse it to answer Q2 - IMMUTABLE METHODS!!!
    const newToStack = transfer.concat(acc[toStack]);
    acc[fromStack] = newFromStack;
    acc[toStack] = newToStack;
    return acc;
  },
  //   so we never alter the original data in place
  arrOfStacks.slice(0)
);

const processedDataQ2 = movedStacksQ2.map((stack) => stack[0]).join("");

console.dir(
  {
    processedDataQ1,
    processedDataQ2,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
