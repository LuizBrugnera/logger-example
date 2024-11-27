const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

async function readLogs() {
  const logData = await fs.readFile('logs/application.log', 'utf8');
  return logData.split('\n').filter(Boolean).map(line => {
    const log = JSON.parse(line);
    log.timestamp = new Date(log.timestamp);
    return log;
  });
}

function processTrafficData(logs, granularity, level) {
  const trafficData = {};
  logs.forEach(log => {
    if (level && log.level !== level) return;

    let key;
    switch (granularity) {
      case 'minute':
        key = log.timestamp.toISOString().slice(0, 16);
        break;
      case 'hour':
        key = log.timestamp.toISOString().slice(0, 13);
        break;
      case 'day':
      default:
        key = log.timestamp.toISOString().slice(0, 10);
    }

    if (!trafficData[key]) {
      trafficData[key] = 0;
    }
    trafficData[key]++;
  });
  return Object.entries(trafficData).map(([date, count]) => ({ date, count }));
}

function countAnomalies(logs) {
  return logs.filter(log => log.level === 'error' || log.level === 'critical').length;
}

app.get('/', async (req, res) => {
  try {
    const logs = await readLogs();
    res.render('dashboard', { logs });
  } catch (error) {
    console.error('Error reading log file:', error);
    res.status(500).send('Error reading log file');
  }
});

app.get('/graphs', async (req, res) => {
  try {
    const logs = await readLogs();
    const trafficData = processTrafficData(logs, 'day');
    const anomalyCount = countAnomalies(logs);
    res.render('graphs', { trafficData, anomalyCount });
  } catch (error) {
    console.error('Error processing log data:', error);
    res.status(500).send('Error processing log data');
  }
});

app.get('/api/traffic', async (req, res) => {
  try {
    const logs = await readLogs();
    const { granularity, level } = req.query;
    const trafficData = processTrafficData(logs, granularity, level);
    res.json(trafficData);
  } catch (error) {
    console.error('Error processing log data:', error);
    res.status(500).json({ error: 'Error processing log data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
