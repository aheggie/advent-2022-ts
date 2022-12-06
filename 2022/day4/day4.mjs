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

const minOfTwoElves = (elfOneMin, elfTwoMin) =>
  elfOneMin < elfTwoMin ? "elfOne" : "elfTwo";
const maxOfTwoElves = (elfOneMax, elfTwoMax) =>
  elfOneMax > elfTwoMax ? "elfOne" : "elfTwo";

const cleanedData = rawData.map((fullStr) =>
  fullStr
    .split(",")
    .map((singleElfStr) =>
      singleElfStr.split("-").map((numChar) => parseInt(numChar, 10))
    )
);

console.dir(
  {
    cleanedData,
  },
  { showHidden: true, depth: null, maxArraySize: null }
);
