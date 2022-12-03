import { readFileSync } from "node:fs";

//import the data
const rawData = readFileSync("./alexandra/input.txt", "utf8");

//split into separate lists for each elf
const elfStrings = rawData.trim().split("\n\n");

const badElf = elfStrings[253];

//sum each elf
const processEachElf = (elfString) =>
  elfString
    .trim()
    // split into list of numberStings
    .split("\n")
    // convert from STING to number
    .map((numberString) => parseInt(numberString))
    // sum each elf to a single integer
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

const elfSums = elfStrings.map(processEachElf);

// FIX THIS
// const badElfList = badElf.trim().split("\n");
// const badElfNumList = badElfList.map((numberString) => parseInt(numberString));
// const badElfSum = badElfNumList.reduce((acc, cur) => acc + cur);

// const isThereNaN = elfSums.includes(NaN);
// const indexOfNaN = elfSums.findIndex((n) => Number.isNaN(n));

//find max elf
const elvesDescending = elfSums.slice(0).sort((sumA, sumB) => sumB - sumA);

const elfMax = elfSums.reduce((acc, cur) => (acc >= cur ? acc : cur));

const elfMaxLocation = elfSums.indexOf(elfMax);

// find sum of top three elves
const topThreeSum = elvesDescending.slice(0, 3).reduce((acc, cur) => acc + cur);

// find min elf

const elfMin = elfSums.slice(0).sort((sumA, sumB) => sumA - sumB)[0];

const elfMinLocation = elfSums.indexOf(elfMin);

//print out result
const output = {
  //   elvesLength: elfStrings.length,
  //   badElf,
  //   badElfList,
  //   badElfNumList,
  //   badElfSum,
  //   indexOfNaN,
  elfMax,
  elfMaxLocation,
  elfMin,
  elfMinLocation,
  topThreeSum,
  //   isThereNaN,
};
console.log(output);

//emily messing around (sorry Alex)
