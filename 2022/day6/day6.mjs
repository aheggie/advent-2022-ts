import { readFileSync } from "node:fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData = readFileSync(`./data/${arg}.txt`, "utf8").trim().split("");

// this function presumes that there WILL be a markerLength character long section with no repeat
const processBufferArr = (bufferArr, markerLength) => {
  for (let i = markerLength; i < bufferArr.length; i++) {
    const selection = bufferArr.slice(i - markerLength, i);
    if (selection.length === new Set(selection).size) {
      return { num: i, value: selection };
    }
  }
  throw new Error(
    `Buffer has no marker sequance of length ${markerLength} with no repeats`
  );
};

const processedDataQ1 = processBufferArr(rawData, 4);
const processedDataQ2 = processBufferArr(rawData, 14);

console.dir(
  { processedDataQ1, processedDataQ2 },
  {
    showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
