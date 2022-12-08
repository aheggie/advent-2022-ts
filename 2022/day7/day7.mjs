import { readFileSync } from "node:fs";

const arg = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  .split(arg === "test" ? "\r\n" : "\n");

const isNumeric = (str) => {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

const parsedData = rawData.map((lineStr, idx) => {
  const lineArr = lineStr.trim().split(" ");
  if (lineArr[0] === "$") {
    return { type: "instruction" };
  } else if (lineArr[0] === "dir") {
    return { type: "directory", name: lineArr[1], size: undefined };
  } else if (isNumeric(lineStr[0])) {
    return { type: "file", name: lineArr[1], size: lineArr[0] };
  } else {
    throw new Error(`error instruction type at index: ${idx}: " ${lineStr} "`);
  }
});

console.dir(
  { parsedData },
  {
    showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
