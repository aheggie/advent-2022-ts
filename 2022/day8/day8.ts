import { Dir, readFileSync } from "fs";

const arg: string = process.argv[2];

if (arg !== "test" && arg !== "input") {
  throw new Error("argument must be 'test' or 'input'");
}

interface Tree {
  height: number;
  position: [number, number];
  onLeftEdge: boolean;
  onRightEdge: boolean;
  onTopEdge: boolean;
  onBottomEdge: boolean;
  visibleFromLeft: "unprocessed" | boolean;
  visibleFromRight: "unprocessed" | boolean;
  visibleFromTop: "unprocessed" | boolean;
  visibleFromBottom: "unprocessed" | boolean;
}

const processLine =
  (from: "Left" | "Right" | "Top" | "Bottom") => (treeLine: Tree[]) => {
    const { outputTreeLine } = treeLine.reduce(
      (
        {
          currentHighest,
          outputTreeLine,
        }: { currentHighest: Number; outputTreeLine: Tree[] },
        cur: Tree
      ) => {
        const isHeighest = cur.height > currentHighest;
        const newHighest = isHeighest ? cur.height : currentHighest;
        const visKey = `visibleFrom${from}`;
        const edgeKey = `on${from}Edge`;
        const newTree = {
          ...cur,
          [visKey]: cur[edgeKey] || isHeighest,
        };
        const newTreeLine = outputTreeLine.concat(newTree);
        return { currentHighest: newHighest, outputTreeLine: newTreeLine };
      },
      {
        currentHighest: 0,
        outputTreeLine: [],
      } as { currentHighest: Number; outputTreeLine: Tree[] }
    );

    return outputTreeLine;
  };

const rawData = readFileSync(`./data/${arg}.txt`, "utf8")
  .trim()
  // this is because the test data, which is copy-pasted from the problem, saves with a different newline convention
  // than the generated problem data
  .split(arg === "test" ? "\r\n" : "\n")
  .map((line, lineIdx, linesArr): Tree[] => {
    const isFirstLine = lineIdx === 0;
    const isLastLine = lineIdx === linesArr.length - 1;
    return line
      .trim()
      .split("")
      .map((treeHeight, treeIdx, treesArr): Tree => {
        const isFirstColumn = treeIdx === 0;
        const isLastColumn = treeIdx === treesArr.length - 1;
        return {
          height: parseInt(treeHeight, 10),
          position: [lineIdx, treeIdx],
          //   this is sort of derived state but it simplifies data processing later
          onLeftEdge: isFirstColumn,
          onRightEdge: isLastColumn,
          onTopEdge: isFirstLine,
          onBottomEdge: isLastLine,
          visibleFromLeft: isFirstColumn ? true : "unprocessed",
          visibleFromRight: isLastColumn ? true : "unprocessed",
          visibleFromTop: isFirstLine ? true : "unprocessed",
          visibleFromBottom: isLastLine ? true : "unprocessed",
        };
      });
  });

const rowsProcessed = rawData.map((line: Tree[]): Tree[] => {
  const leftProcessed = processLine("Left")(line);
  return processLine("Right")(leftProcessed.reverse()).reverse();
});

const flipSquareMatrix = (matrix) =>
  matrix.reduce((acc, cur) => {
    cur.forEach((item, idx) => {
      if (acc[idx]) {
        return (acc[idx] = acc[idx].concat(item));
      } else {
        return (acc[idx] = [item]);
      }
    });
    return acc;
  }, []);

const forestFlipped = flipSquareMatrix(rowsProcessed);

const columnsProcessed = forestFlipped.map((line: Tree[]): Tree[] => {
  const topProcessed = processLine("Top")(line);
  return processLine("Bottom")(topProcessed.reverse()).reverse();
});

const processedForest = flipSquareMatrix(columnsProcessed);

const visibilityMap = processedForest.map((line) =>
  line.map(
    (tree) =>
      tree.visibleFromLeft ||
      tree.visibleFromRight ||
      tree.visibleFromBottom ||
      tree.visibleFromTop
  )
);

const visibilityCount = visibilityMap.reduce(
  (forestTotal, currentLine) =>
    forestTotal +
    currentLine.reduce(
      (lineTotal, currentTreeBool) =>
        currentTreeBool ? lineTotal + 1 : lineTotal,
      0
    ),
  0
);

console.dir(
  {
    // processedForest,
    // visibilityMap,
    visibilityCount,
  },
  {
    // showHidden: true,
    depth: null,
    maxArrayLength: null,
  }
);
