import { readFileSync, writeFileSync } from "fs";

const forest = readFileSync(`./data/${process.argv[2]}.txt`, "utf8");

writeFileSync(`./output/${process.argv[2]}.json`, JSON.stringify({ forest }));
