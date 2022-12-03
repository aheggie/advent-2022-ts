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

const elves = elfStrings.map(processEachElf);

//find max elf

//print out result
// console.log(rawData, JSON.stringify(rawData))
const output = elves;
console.log(output);
