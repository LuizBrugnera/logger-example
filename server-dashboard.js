const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const logData = await fs.readFile('logs/application.log', 'utf8');
    const logs = logData.split('\n').filter(Boolean).map(line => {
      const log = JSON.parse(line);
      log.date = new Date(log.timestamp).toISOString().split('T')[0];
      return log;
    });
    res.render('dashboard', { logs });
  } catch (error) {
    console.error('Error reading log file:', error);
    res.status(500).send('Error reading log file');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

