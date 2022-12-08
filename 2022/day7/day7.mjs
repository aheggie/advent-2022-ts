import { readFileSync } from "node:fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  .split(arg === "test" ? "\r\n" : "\n");

const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

const parsedData = rawData.map((lineStr, idx) => {
  let currentDir = "/";
  const lineArr = lineStr.trim().split(" ");
  if (lineArr[0] === "$") {
    if (lineArr[1] === "cd") {
      const to = lineArr[2];
      currentDir = to;
      return { type: "instruction", action: "cd", to };
    } else if (lineArr[1] === "ls") {
      return { type: "instruction", action: "ls" };
    } else {
      throw new Error(
        `unknown instruction action and idx: ${idx}: " ${lineStr} "`
      );
    }
  } else if (lineArr[0] === "dir") {
    return {
      type: "directory",
      name: lineArr[1],
      childOf: currentDir,
      size: 0,
    };
  } else if (isNumeric(lineStr[0])) {
    return {
      type: "file",
      name: lineArr[1],
      childOf: currentDir,
      size: lineArr[0],
    };
  } else {
    throw new Error(`error instruction type at index: ${idx}: " ${lineStr} "`);
  }
});

//the following code is to establish whether all ls operation happen only on newly seen directories
//i.e. can an ls operation indicate we are seeing a directory for the first time?
//it CANT - ls is run up to 16 times on visiting an already-seen directory
const justChangesWithLists = parsedData
  .filter((instrObj, idx, arr) => {
    if (
      instrObj.type === "instruction" &&
      instrObj.action === "cd" &&
      arr[idx + 1].type === "instruction" &&
      arr[idx + 1].action === "ls"
    ) {
      return true;
    } else {
      return false;
    }
  })
  .map(({ to }) => to);

const justChangesWithListsSet = new Set(justChangesWithLists);

const areAllLsOpsOnNewDirs =
  justChangesWithLists.length === justChangesWithListsSet.size;

const repeats = justChangesWithLists.length - justChangesWithListsSet.size;

const countRepeats = justChangesWithLists.reduce((acc, curr) => {
  if (acc.hasOwnProperty(curr)) {
    acc[curr] += 1;
  } else {
    acc[curr] = 1;
  }
  return acc;
}, {});
//end section checking for ls repeats

console.dir(
  { areAllLsOpsOnNewDirs, repeats, countRepeats },
  {
    showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
