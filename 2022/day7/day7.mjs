import { readFileSync, writeFileSync } from "node:fs";

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

const moveUp = (path) => `${path.split("/").slice(0, -2).join("/")}/`;

let currentPath = "/";
const parsedData = rawData.map((lineStr, idx) => {
  const lineArr = lineStr.trim().split(" ");
  if (lineArr[0] === "$") {
    if (lineArr[1] === "cd") {
      const to = lineArr[2];
      if (to === "..") {
        currentPath = moveUp(currentPath);
      } else if (to === "/") {
        currentPath = to;
      } else {
        currentPath = `${currentPath}${to}/`;
      }
      return { type: "instruction", action: "cd", currentPath, to };
    } else if (lineArr[1] === "ls") {
      return { type: "instruction", action: "ls", currentPath };
    } else {
      throw new Error(
        `unknown instruction action and idx: ${idx}: " ${lineStr} "`
      );
    }
  } else if (lineArr[0] === "dir") {
    return {
      type: "directory",
      name: `${currentPath}${lineArr[1]}/`,
      currentPath,
      //   prepping these objects for later use
      size: 0,
      sizeOfDirectChildFiles: 0,
      childDirectories: [],
    };
  } else if (isNumeric(lineStr[0])) {
    return {
      type: "file",
      //   no trailing slash as its a file!
      name: `${currentPath}${lineArr[1]}`,
      currentPath,
      size: parseInt(lineArr[0], 10),
    };
  } else {
    throw new Error(`error instruction type at index: ${idx}: " ${lineStr} "`);
  }
});

//the following code is to establish whether all ls operation happen only on newly seen directories
//i.e. can an ls operation indicate we are seeing a directory for the first time?
//running this code proves it DOES - ls is only run on a new dir
// the code is commented but left for re-proving the above point as neccesary
// const justChangesWithLists = parsedData
//   .filter((instrObj, idx, arr) => {
//     if (
//       instrObj.type === "instruction" &&
//       instrObj.action === "cd" &&
//       arr[idx + 1].type === "instruction" &&
//       arr[idx + 1].action === "ls"
//     ) {
//       return true;
//     } else {
//       return false;
//     }
//   })
//   .map(({ currentPath }) => currentPath);

// const justChangesWithListsSet = new Set(justChangesWithLists);

// const areAllLsOpsOnNewDirs =
//   justChangesWithLists.length === justChangesWithListsSet.size;

// const lsRepeats = justChangesWithLists.length - justChangesWithListsSet.size;

// const countLsRepeats = justChangesWithLists.reduce((acc, curr) => {
//   if (acc.hasOwnProperty(curr)) {
//     acc[curr] += 1;
//   } else {
//     acc[curr] = 1;
//   }
//   return acc;
// }, {});
//end section checking for ls repeats

const rawListOfDirectories = parsedData.filter(
  ({ type }) => type === "directory"
);

const rawListOfFiles = parsedData.filter(({ type }) => type === "file");

// uniqueness testing - the files and the directories are unique
// const rawDirectoryNames = rawListOfDirectories.map(({ name }) => name);
// const uniqueDirectoryNames = [...new Set(rawDirectoryNames)];

// const checkDirectorRepeats =
//   rawDirectoryNames.length - uniqueDirectoryNames.length;

// const rawFileNames = rawListOfFiles.map(({ name }) => name);
// const uniqueFileNames = [...new Set(rawFileNames)];

// const checkFileRepeats = rawFileNames.length - uniqueFileNames.length;

// confident from commented checking above that directories are unique - so this should work without bugs
// otherwise it might only index the last instance of a repeated directory

const directoriesObj = [
  {
    type: "directory",
    name: "/",
    currentPath: "root",
    size: 0,
    sizeOfDirectChildFiles: 0,
    childDirectories: [],
  },
]
  .concat(rawListOfDirectories)
  .reduce((acc, dir) => {
    acc[dir.name] = dir;
    return acc;
  }, {});

const dirsWithFiles = rawListOfFiles.reduce(
  (acc, file) => {
    acc[file.currentPath].sizeOfDirectChildFiles += file.size;
    return acc;
  },
  { ...directoriesObj }
);

const dirsWithFilesAndChildren = rawListOfDirectories.reduce(
  (acc, dir) => {
    console.log(acc[dir.currentPath]);
    acc[dir.currentPath].childDirectories = acc[
      dir.currentPath
    ].childDirectories.concat([dir.name]);
    return acc;
  },
  { ...dirsWithFiles }
);

let workingDirs = { ...dirsWithFilesAndChildren };

const withFileSizes = rawListOfFiles.forEach(({ currentPath, size }) => {
  workingDirs["/"].size += size;
  // hmmm a reducer shouldnt have a side effect
  currentPath
    .split("/")
    .slice(1, -1)
    .reduce((acc, individualDir) => {
      const current = `${acc}${individualDir}/`;
      workingDirs[current].size += size;
      return current;
    }, "/");
});

const sizes = Object.keys(workingDirs).map((key) => workingDirs[key].size);
const processedDataQ1 = sizes
  .filter((size) => size < 100000)
  .reduce((acc, cur) => acc + cur);

writeFileSync("./data/output.json", JSON.stringify(workingDirs));

const allSpaceUsed = workingDirs["/"].size;

const totalDiskSpace = 70000000;
const installSize = 30000000;
const spaceRemaining = totalDiskSpace - allSpaceUsed;
const spaceNeeded = installSize - spaceRemaining;

const processedDataQ2 = sizes
  .filter((size) => size > spaceNeeded)
  .sort((a, b) => a - b)[0];

console.dir(
  {
    processedDataQ1,
    allSpaceUsed,
    spaceNeeded,
    spaceRemaining,
    processedDataQ2,
    // test: moveUp("/a/a/a/a/"),
  },
  {
    showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
