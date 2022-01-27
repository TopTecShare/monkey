// art generate for unrevealed
const fs = require("fs");
const metadataDir = "metadata";
for (let l = 0; l < 12001; l++) {
  const filename = `${metadataDir}/${l}.json`;
  const JsonExport = {
    name: `#${l}`,
    title: "Mooning Monkey",
    description:
      "Start your Mooning Monkey evolution process now and try to own an Elite Eternal Yeti. Only 500 will ever exist!",
    image:
      "https://ipfs.io/ipfs/QmYAM4iERwfdaLa3x6MFY1J1ZCNM6QfLnfMhSYjFNNQLSL",
    attributes: [],
  };
  const jsonStr = JSON.stringify(JsonExport);
  fs.writeFileSync(filename, jsonStr, "utf8");
}
