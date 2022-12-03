import { readFileSync } from "node:fs";

//import the data
const rawData = readFileSync("./alexandra/input.txt", "utf8");

//split into separate lists for each elf
const elfStrings = rawData.split("\n\n");

//sum each elf
const processEachElf = (elfString) =>
  elfString
    // split into list of numberStings
    .split("\n")
    // convert from STING to number
    .map((numberString) => parseInt(numberString))
    // sum each elf to a single integer
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

const elfSums = elfStrings.map(processEachElf);

//find max elf
const elfMax = elfSums.slice(0).sort((sumA, sumB) => sumB - sumA)[0];

const elfLocation = elfSums.indexOf(elfMax);

// find min elf

//print out result
const output = { elfMax, elfLocation };
console.log(output);
