import { readFileSync } from "node:fs";

//import the data
const rawData = readFileSync("./alexandra/input.txt", "utf8");

//trim whitespace split into separate lists for each elf
const elfStrings = rawData.trim().split("\n\n");

//sum each elf
const processEachElf = (elfString) =>
  elfString
    // trim whitespace per elf - slightly defensive see trim on import above
    .trim()
    // split into list of numberStings
    .split("\n")
    // convert from STING to number
    .map((numberString) => parseInt(numberString))
    // sum each elf to a single integer
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

const elfSums = elfStrings.map(processEachElf);

//find max elf
const elvesDescending = elfSums.slice(0).sort((sumA, sumB) => sumB - sumA);

const elfMax = elvesDescending[0];

const elfMaxLocation = elfSums.indexOf(elfMax);

// find sum of top three elves
const topThreeSum = elvesDescending.slice(0, 3).reduce((acc, cur) => acc + cur);

// find min elf

const elfMin = elfSums.slice(0).sort((sumA, sumB) => sumA - sumB)[0];

const elfMinLocation = elfSums.indexOf(elfMin);

//print out result
const output = {
  elfMax,
  elfMaxLocation,
  elfMin,
  elfMinLocation,
  topThreeSum,
};
console.log(output);

//emily messing around (sorry Alexandra)
