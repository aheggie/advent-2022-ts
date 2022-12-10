import { Dir, readFileSync } from "fs";

const arg: string = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

const rawData: string[] = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  // this is because the test data, which is copy-pasted from the problem, saves with a different newline convention
  // than the generated problem data
  .split(arg === "test" ? "\r\n" : "\n");

// this is from stackoverflow to check numeric with certainty
// well use this to identify file statements in the data
// as the string of a file statement starts with a numeric integer
const isNumeric = (str: string): boolean => {
  // if (typeof str != "string") return false; // we only process strings!
  return (
    // !isNaN(str) && //use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
};

// performs the `cd ..` operation on a path string
// so moveUp("/a/b/") will return "/a/" and so forth
const moveUp = (path: string): string =>
  `${path.split("/").slice(0, -2).join("/")}/`;

interface Directory {
  type: "directory";
  name: string;
  currentPath: string;
  size: number;
}

interface File {
  type: "file";
  name: string;
  currentPath: string;
  size: number;
}

interface DirectoriesDict {
  [key: string]: Directory;
}

type ProblemData = Directory | File;

const { parsedDataArr }: { parsedDataArr: ProblemData[] } = rawData.reduce(
  // idx is just taken to defensively identify the lines causing parsing errors
  // in the given data we find no parsing errors
  ({ currentPath, parsedDataArr }, lineStr, idx) => {
    const lineArr = lineStr.trim().split(" ");
    if (lineArr[0] === "$") {
      if (lineArr[1] === "cd") {
        const to = lineArr[2];
        let newPath;
        if (to === "..") {
          newPath = moveUp(currentPath);
        } else if (to === "/") {
          newPath = to;
        } else {
          newPath = `${currentPath}${to}/`;
        }
        // we never use this data again after defining the current active path, so we don't append this to the data arr
        return { currentPath: newPath, parsedDataArr };
      } else if (lineArr[1] === "ls") {
        // `ls` instructions arent used in data processing
        return { currentPath, parsedDataArr };
      } else {
        // in theory the data COULD have `$ some-other-cli arg1 arg2`
        throw new Error(
          `unknown instruction action and idx: ${idx}: " ${lineStr} "`
        );
      }
    } else if (lineArr[0] === "dir") {
      return {
        // currentPath ONLY changes with a `cd` instruction
        currentPath,
        // for directories we add a structured object carrying their metadata to the parsedDataArr
        parsedDataArr: parsedDataArr.concat({
          type: "directory",
          name: `${currentPath}${lineArr[1]}/`,
          currentPath,
          //   currently zero as empty directories have no inherent size by business rules
          // will grow later to count files and subdirectories, if there are any
          size: 0,
        }),
      };
    } else if (isNumeric(lineArr[0])) {
      return {
        // currentPath ONLY changes with a `cd` instruction

        currentPath,
        // for files we add a structured object containing their metadta to the parsedDataArr
        parsedDataArr: parsedDataArr.concat({
          type: "file",
          //   no trailing slash as its a file!
          name: `${currentPath}${lineArr[1]}`,
          currentPath,
          size: parseInt(lineArr[0], 10),
        }),
      };
    } else {
      throw new Error(
        `unknown statement type at index: ${idx}: " ${lineStr} "`
      );
    }
  },
  // currentPath is working memory inside the reducer, parsedDataArr is the processed data we will keep
  { currentPath: "/", parsedDataArr: [] } as {
    currentPath: string;
    parsedDataArr: ProblemData[];
  }
);

const directoriesArr: Directory[] = parsedDataArr.filter(
  (item): item is Directory => item.type === "directory"
);

const filesArr: File[] = parsedDataArr.filter(
  (item): item is File => item.type === "file"
);

// uniqueness testing - proving the files and the directories are unique, otherwise the reducers later on will
// process a repeated entry [repeat] times, introducing potentially obscure bugs

// a Set of objects won't examine them deeply enough to prove uniqueness so we extract name to do a set of simple string
// name is the unique full path of the directory
const directoryNames: string[] = directoriesArr.map(
  ({ name }: Directory): string => name
);
const uniqueDirectoryNames: Set<string> = new Set(directoryNames);

if (directoriesArr.length !== uniqueDirectoryNames.size) {
  throw new Error("There are repeats of directories in the list");
}

// name is the unique full path of the file
const fileNames: string[] = filesArr.map(({ name }: File): string => name);
const uniqueFileNames: Set<string> = new Set(fileNames);

if (fileNames.length !== uniqueFileNames.size) {
  throw new Error("there are repeats of files in the list");
}

//confident that the directories are unique in their array, we reduce that array of x items into an object with x children
// each child is ONE directory, keyed on its unique full path
const directoriesDict: DirectoriesDict = [
  // this is concatted on here because root is never listed as a directory in the instruction set
  // and so is not filtered into the list of directories above
  {
    type: "directory",
    name: "/",
    currentPath: "root",
    size: 0,
  } as Directory,
]
  .concat(directoriesArr)
  .reduce((acc, dir) => {
    acc[dir.name] = dir;
    return acc;
  }, {} as DirectoriesDict);

// we go through the list of files, which we have tested for uniqueness and
// add their size to EVERY directory above them in the tree
// which we can build from their full file path
// order is O(rawListOFFiles.length * max_number_of_directories_in_a_path)
// so O(n**2) really but in practice short-ish because the depth of the directory tree is max
// like 5 directories in the problem input
const directoriesWithTotalSizes: DirectoriesDict = filesArr.reduce(
  (
    directoriesAcc: DirectoriesDict,
    { currentPath, size }: File
  ): DirectoriesDict => {
    // the goal here is to produce an array with each valid sub path above the file
    // i.e. ["/", "/topdir/", "/topdir/subdir/", ...] etc.
    const { pathsArr } = currentPath
      .split("/")
      // slicing e.g. "/a/b/" on "/" produces ["", "a", "b", ""] so we remove the empty strings at beginning and end
      .slice(1, -1)
      .reduce(
        ({ pastPath, pathsArr }, individualDir) => {
          const newPath = `${pastPath}${individualDir}/`;
          const newPathsArr = pathsArr.concat(newPath);
          return { pastPath: newPath, pathsArr: newPathsArr };
        },
        { pastPath: "/", pathsArr: ["/"] }
      );
    // having an array of every valid path above file, we just add file's size to the size of each directory above it
    // remember that the directory dict's keys are strings of directory paths
    pathsArr.forEach(
      (directoryPath) => (directoriesAcc[directoryPath].size += size)
    );
    return directoriesAcc;
  },
  { ...directoriesDict }
);

// this then maps over ALL directory names to produce an array of the total size associated with that name
const sizes: number[] = Object.keys(directoriesWithTotalSizes).map(
  (key: string): number => directoriesWithTotalSizes[key].size
);

const processedDataQ1: number = sizes
  .filter((size) => size < 100000)
  .reduce((acc, cur) => acc + cur);

const allSpaceUsed: number = directoriesWithTotalSizes["/"].size;

const totalDiskSpace: number = 70000000;
const installSize: number = 30000000;
const spaceRemaining: number = totalDiskSpace - allSpaceUsed;
const spaceNeeded: number = installSize - spaceRemaining;

const processedDataQ2: number = sizes
  .filter((size) => size > spaceNeeded)
  .sort((a, b) => a - b)[0];

console.dir(
  {
    processedDataQ1,
    processedDataQ2,
  },
  {
    showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
