const fs = require('fs');
const path = require('path');

const levels = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
};

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

function formatLog(level, message, meta) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(logEntry);
}

function log(level, message, meta = {}) {
  if (!levels[level]) {
    throw new Error(`Nível de log inválido: ${level}`);
  }

  const formattedLog = formatLog(level, message, meta);

  const logFilePath = path.join(logDir, 'application.log');
  fs.appendFileSync(logFilePath, formattedLog + '\n', 'utf8');

  console.log(formattedLog);
}

const logger = {
  debug: (message, meta) => log('debug', message, meta),
  info: (message, meta) => log('info', message, meta),
  warning: (message, meta) => log('warning', message, meta),
  error: (message, meta) => log('error', message, meta),
  critical: (message, meta) => log('critical', message, meta),
};

module.exports = logger;
