// ---------------------------------------------------------------------------
// build-data-from-kaggle.mjs
//
// Regenerates data/triage-data.js severity weights from the Kaggle dataset so
// the data lineage is real (SDG 3 requirement: data hosted on Kaggle).
//
// 1. Download the dataset from Kaggle:
//    https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset
// 2. Place these files in ./kaggle/ :
//      Symptom-severity.csv, symptom_precaution.csv, dataset.csv
// 3. Run:  npm run build:data
//
// This starter version reads Symptom-severity.csv and prints the weight map so
// you can paste/merge it into data/triage-data.js. Kept dependency-free.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "kaggle", "Symptom-severity.csv");

if (!fs.existsSync(file)) {
  console.log(
    "No kaggle/Symptom-severity.csv found.\n" +
      "Download it from Kaggle (see header of this file) and place it in ./kaggle/.\n" +
      "The app ships with a working curated subset, so this step is optional."
  );
  process.exit(0);
}

const rows = fs.readFileSync(file, "utf8").trim().split("\n").slice(1);
const map = {};
for (const row of rows) {
  const [symptom, weight] = row.split(",");
  if (!symptom) continue;
  const id = symptom.trim().toLowerCase().replace(/\s+/g, "_");
  map[id] = Number(weight);
}

console.log("// Paste/merge into data/triage-data.js (severity weights):");
console.log(JSON.stringify(map, null, 2));
