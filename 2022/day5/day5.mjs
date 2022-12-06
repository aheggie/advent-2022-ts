import { readFileSync } from "node:fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  .split("\n")
  //   defensive see full trim above
  .map((str) => str.trim());

const cleanedData = rawData.map((fullStr) => {});

console.dir(
  {
    rawData,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
