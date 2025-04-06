const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

function parseCSVArray(value) {
  if (!value || value.trim() === "") return [];
  return value.split(",").map((v) => v.trim());
}

function parseDiagnosticConditionsCSV(filePath = "./csv/conditions.csv") {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(path.resolve(filePath))
      .pipe(csv())
      .on("data", (row) => {
        const nameKey = Object.keys(row).find((k) =>
          k.trim().toLowerCase().includes("name")
        );
        const name = row[nameKey]?.trim() || null;

        results.push({
          name,
          diagnostic_metrics: parseCSVArray(row.diagnostic_metrics),
        });
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

module.exports = {
  parseDiagnosticConditionsCSV,
};
