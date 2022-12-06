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

const cleanedData = rawData.map((fullStr) =>
  fullStr
    .split(",")
    .map((singleElfStr) =>
      singleElfStr.split("-").map((numChar) => parseInt(numChar, 10))
    )
);

const processDataQ1 = cleanedData
  .map(([elfOne, elfTwo]) => ({
    elfOneEncompassing: elfOne[0] <= elfTwo[0] && elfOne[1] >= elfTwo[1],
    elfTwoEncompassing: elfTwo[0] <= elfOne[0] && elfTwo[1] >= elfOne[1],
    elfOne,
    elfTwo,
  }))
  .filter(
    ({ elfOneEncompassing, elfTwoEncompassing }) =>
      elfOneEncompassing || elfTwoEncompassing
  );

const processDataQ2 = cleanedData
  .map(([elfOne, elfTwo]) => ({
    elfOneStrictlySmaller: elfOne[1] < elfTwo[0],
    elfTwoStrictlySmaller: elfTwo[1] < elfOne[0],
    elfOne,
    elfTwo,
  }))
  .filter(
    ({ elfOneStrictlySmaller, elfTwoStrictlySmaller }) =>
      !(elfOneStrictlySmaller || elfTwoStrictlySmaller)
  );

console.dir(
  {
    cleanedData,
    processDataQ1,
    processDataQ2,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
