import { readFileSync } from 'node:fs';

//import the data
const rawData = readFileSync("./alexandra/input.txt", "utf8")

//split into separate lists for each elf
const elfStrings = rawData.split("\n\n")

//sum each elf
const processEachElf = elfString => {
    return elfString.split("\n").map(numberString => parseInt(numberString))
    
}

const elves = elfStrings.map(processEachElf)


//find max elf


//print out result
// console.log(rawData, JSON.stringify(rawData))
const output = elves
console.log(output)
