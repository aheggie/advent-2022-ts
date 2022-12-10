import { readFileSync } from "fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

//its INSANE to have to implement basic set operations but here we are
// from MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const intersect = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const _intersection: Set<T> = new Set();
  for (const elem of setB) {
    if (setA.has(elem)) {
      // dont love this mutation
      _intersection.add(elem);
    }
  }
  return _intersection;
};

// this functions expects a Set of a single letter character and extracts that character as a number
// mostly defensive error checking if it doesnt receive a Set of a single letter character
// optional index argument for processing arrays assumed to be of single character sets
const singleCharSetToInt = (
  singleCharSet: Set<string>,
  index: number | null = null
): number => {
  if (singleCharSet.size > 1) {
    throw new Error(`too many elements in set${index ? ` at ${index}` : null}`);
  }
  if (singleCharSet.size === 0) {
    throw new Error(`no overlapping elements${index ? ` at ${index}` : null}`);
  }
  const singleChar = [...singleCharSet][0];
  const charCode = singleChar.charCodeAt(0);
  if (64 < charCode && charCode < 91) {
    // this is a magic number by business rules and in a production function id specify this offset with an argument
    return charCode - 38;
  } else if (96 < charCode && charCode < 123) {
    // business rules say no offset here
    return charCode - 96;
  } else {
    throw new Error(
      `non-letter character ${singleChar}${index ? ` at ${index}` : null}`
    );
  }
};

const rawData: string[] = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  .split("\n")
  .map((str) => str.trim());

const processedDataQ1: number = rawData
  .map((rucksack: string): number => {
    const rucksackTrim = rucksack.trim();
    const midpoint = rucksackTrim.length / 2;
    const compartmentA = new Set(rucksackTrim.substring(0, midpoint).split(""));
    const compartmentB = new Set(rucksackTrim.substring(midpoint).split(""));
    const overlapSet = intersect(compartmentA, compartmentB);
    return singleCharSetToInt(overlapSet);
  })
  .reduce((acc, curr) => acc + curr);

const processedDataQ2 = rawData
  .map((str: string): Set<string> => new Set(str.split("")))
  .reduce(
    (
      acc: Set<string>[][],
      _cur, //we dont use this value directly
      index: number,
      arr: Set<string>[]
    ): Set<string>[][] =>
      (index + 1) % 3 === 0
        ? acc.concat([arr.slice(index - 2, index + 1)])
        : acc,
    [] as Set<string>[][]
  )
  .map((subArr) =>
    singleCharSetToInt(intersect(intersect(subArr[0], subArr[1]), subArr[2]))
  )
  .reduce((acc, curr) => acc + curr);
console.dir(
  {
    processedDataQ1,
    processedDataQ2,
  },
  { showHidden: true, depth: null, maxArrayLength: null }
);
