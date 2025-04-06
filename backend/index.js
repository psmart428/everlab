const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { parseHL7 } = require('./utils/parseUtils');
const { parseDiagnosticMetricsCSV } = require('./utils/parseDiagnosticMetrics');
const { parseDiagnosticConditionsCSV } = require('./utils/parseDiagnosticConditions');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/api/upload-oru', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.resolve(uploadedFile.path);

  fs.readFile(filePath, 'utf8', (err, fileContent) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read file' });
    }

    try {
      const parsed = parseHL7(fileContent);
      res.json(parsed);
    } catch (e) {
      res.status(400).json({ error: 'Parsing failed' });
    } finally {
      fs.unlink(filePath, () => {});
    }
  });
});

app.get('/api/diagnostic-metrics', async (req, res) => {
  try {
    const data = await parseDiagnosticMetricsCSV();
    res.json(data);
  } catch (err) {
    console.error('CSV parsing failed:', err);
    res.status(500).json({ error: 'Failed to parse diagnostic metrics' });
  }
});

app.get('/api/diagnostic-conditions', async (req, res) => {
  try {
    const data = await parseDiagnosticConditionsCSV();
    res.json(data);
  } catch (err) {
    console.error('CSV parsing failed:', err);
    res.status(500).json({ error: 'Failed to parse diagnostic conditions' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port :${PORT}`);
});
