const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logToFile = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    data,
  };

  const logFilePath = path.join(logsDir, `${level.toLowerCase()}-${new Date().toISOString().split('T')[0]}.log`);
  
  fs.appendFileSync(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
    if (err) console.error('Error writing to log file:', err);
  });

  console.log(`[${level}] ${message}`, data);
};

module.exports = {
  info: (message, data) => logToFile('INFO', message, data),
  error: (message, data) => logToFile('ERROR', message, data),
  warn: (message, data) => logToFile('WARN', message, data),
  debug: (message, data) => logToFile('DEBUG', message, data),
  audit: (message, data) => logToFile('AUDIT', message, data),
};
