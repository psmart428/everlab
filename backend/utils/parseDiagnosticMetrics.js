const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

function parseCSVArray(value) {
  if (!value || value.trim() === '') return [];
  return value.split(';').map(v => v.trim());
}

function parseFloatOrNull(value) {
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function parseIntOrNull(value) {
  const num = parseInt(value);
  return isNaN(num) ? null : num;
}

function parseDiagnosticMetricsCSV(filePath = './csv/diagnostic_metrics.csv') {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(path.resolve(filePath))
      .pipe(csv())
      .on('data', (row) => {
        const nameKey = Object.keys(row).find((k) =>
          k.trim().toLowerCase().includes("name")
        );
        const name = row[nameKey]?.trim() || null;

        results.push({
          name,
          oru_sonic_codes: parseCSVArray(row.oru_sonic_codes),
          diagnostic: row.diagnostic?.trim() || null,
          diagnostic_groups: parseCSVArray(row.diagnostic_groups),
          oru_sonic_units: parseCSVArray(row.oru_sonic_units),
          units: row.units?.trim() || null,
          min_age: parseIntOrNull(row.min_age),
          max_age: parseIntOrNull(row.max_age),
          gender: row.gender?.trim() || null,
          standard_lower: parseFloatOrNull(row.standard_lower),
          standard_higher: parseFloatOrNull(row.standard_higher),
          everlab_lower: parseFloatOrNull(row.everlab_lower),
          everlab_higher: parseFloatOrNull(row.everlab_higher)
        });
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { parseDiagnosticMetricsCSV };
