import { readFileSync } from "node:fs";

const elvesDescending: number[] =
  //import the data
  readFileSync("./alexandra/input.txt", "utf8")
    //trim whitespace
    .trim()
    // split into separate lists for each elf
    .split("\n\n")
    // process each elf into a sum of total carbs
    .map((elfString: string): number =>
      elfString
        // trim whitespace per elf - slightly defensive see trim on import above
        .trim()
        // split into list of numberStings
        .split("\n")
        // convert from STING to number
        .map((numberString: string): number => parseInt(numberString))
        // sum each elf to a single integer
        .reduce(
          (accumulator: number, currentValue: number): number =>
            accumulator + currentValue
        )
    )
    // to make sort immutable
    .slice(0)
    // to sort in descending order
    .sort((sumA, sumB) => sumB - sumA);

//print out result
console.log({
  elfMax: elvesDescending[0],
  topThreeSum: elvesDescending
    // take first three
    .slice(0, 3)
    // sum
    .reduce((acc, cur) => acc + cur),
});
