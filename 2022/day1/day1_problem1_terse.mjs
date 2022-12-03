import { readFileSync } from "node:fs";

const elfSums =
  //import the data
  readFileSync("./alexandra/input.txt", "utf8")
    //trim whitespace
    .trim()
    // split into separate lists for each elf
    .split("\n\n")
    // process each elf into a sum of total carbs
    .map((elfString) =>
      elfString
        // trim whitespace per elf - slightly defensive see trim on import above
        .trim()
        // split into list of numberStings
        .split("\n")
        // convert from STING to number
        .map((numberString) => parseInt(numberString))
        // sum each elf to a single integer
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    );

//find max elf
const elvesDescending = elfSums.slice(0).sort((sumA, sumB) => sumB - sumA);

const elfMax = elvesDescending[0];

const elfMaxLocation = elfSums.indexOf(elfMax);

// find sum of top three elves
const topThreeSum = elvesDescending.slice(0, 3).reduce((acc, cur) => acc + cur);

//print out result
console.log({
  elfMax,
  elfMaxLocation,
  topThreeSum,
});

//emily messing around (sorry Alexandra)
