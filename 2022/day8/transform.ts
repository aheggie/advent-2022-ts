import { readFile, writeFile } from "fs/promises";

readFile(`./data/${process.argv[2]}.txt`, { encoding: "utf8" }).then((forest) =>
  writeFile(`./output/${process.argv[2]}.json`, JSON.stringify({ forest }))
);
