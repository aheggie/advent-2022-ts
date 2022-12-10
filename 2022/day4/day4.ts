import { readFileSync } from "fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData: string[] = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  .split("\n")
  //   defensive see full trim above
  .map((str) => str.trim());

interface Elf {
  minAssignment: number;
  maxAssignment: number;
}

interface ElfPair {
  elfOne: Elf;
  elfTwo: Elf;
}

const cleanedData: ElfPair[] = rawData.map((fullStr: string): ElfPair => {
  const [elfOne, elfTwo]: Elf[] = fullStr
    .split(",")
    .map((singleElfStr: string): Elf => {
      const [minAssignment, maxAssignment]: number[] = singleElfStr
        .split("-")
        .map((numChar) => parseInt(numChar, 10));
      return { minAssignment, maxAssignment };
    });

  return { elfOne, elfTwo };
});

const processDataQ1: number = cleanedData
  .map(({ elfOne, elfTwo }) => ({
    elfOneEncompassing:
      elfOne.minAssignment <= elfTwo.minAssignment &&
      elfOne.maxAssignment >= elfTwo.maxAssignment,
    elfTwoEncompassing:
      elfTwo.minAssignment <= elfOne.minAssignment &&
      elfTwo.maxAssignment >= elfOne.maxAssignment,
  }))
  // if one or the other encompasses their partner
  .filter(
    ({ elfOneEncompassing, elfTwoEncompassing }) =>
      elfOneEncompassing || elfTwoEncompassing
  ).length;

const processDataQ2: number = cleanedData
  .map(({ elfOne, elfTwo }) => ({
    elfOneStrictlySmaller: elfOne.maxAssignment < elfTwo.minAssignment,
    elfTwoStrictlySmaller: elfTwo.maxAssignment < elfOne.minAssignment,
  }))
  // if neither is strictly smaller than the other, then they overlap at least partially
  .filter(
    ({ elfOneStrictlySmaller, elfTwoStrictlySmaller }) =>
      !(elfOneStrictlySmaller || elfTwoStrictlySmaller)
  ).length;

console.dir(
  {
    processDataQ1,
    processDataQ2,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
