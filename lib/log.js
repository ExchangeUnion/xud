const winston = require('winston');
const fs = require('fs');

const logDir = '../log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleString();
winston.configure({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
    }),
    new (winston.transports.File)({
      filename: `${logDir}/xunion.log`,
      timestamp: tsFormat,
    }),
  ],
});

winston.level = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

module.exports = winston;
