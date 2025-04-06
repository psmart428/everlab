const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/api/data', (req, res) => {
  fs.readFile('data.json', 'utf-8', (err, jsonData) => {
    if (err) return res.status(500).json({ error: 'Error reading data' });
    res.json(JSON.parse(jsonData));
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
