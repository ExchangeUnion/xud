const fs = require('fs');
const path = require('path');
const winston = require('winston');
const utils = require('./utils/utils');

class Logger {
  constructor({ level, logDir, context }) {
    this.level = level || Logger.defaultLevel;
    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Logger.contexts.GLOBAL;

    const { format } = winston;
    const logFormat = format.printf(info => `${utils.getTsString(info.timestamp)} ${info.level}: ${info.message}`);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
    this.logger = winston.createLogger({
      level: this.level,
      format: logFormat,
      transports: [
        new winston.transports.Console({ format: format.combine(format.colorize(), logFormat) }),
        new winston.transports.File({
          filename: path.join(this.logDir, Logger.contextsFilename[this.context]),
        }),
      ],
    });

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  log(level, msg) {
    this.logger.log(level, msg);
  }

  error(msg, err) {
    let errMsg;
    if (typeof msg === 'object') {
      // treat msg as an error object
      errMsg = msg.stack;
    } else if (err) {
      errMsg = `${msg} ${err.stack}`;
    } else {
      errMsg = msg;
    }
    this.log(Logger.levelsVal[Logger.levels.ERROR], errMsg);
  }

  warn(msg) {
    this.log(Logger.levelsVal[Logger.levels.WARN], msg);
  }

  info(msg) {
    this.log(Logger.levelsVal[Logger.levels.INFO], msg);
  }

  debug(msg) {
    this.log(Logger.levelsVal[Logger.levels.DEBUG], msg);
  }
}

Logger.levels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

Logger.levelsVal = {
  [Logger.levels.ERROR]: 'error',
  [Logger.levels.WARN]: 'warn',
  [Logger.levels.INFO]: 'info',
  [Logger.levels.DEBUG]: 'debug',
};

Logger.contexts = {
  GLOBAL: 0,
};

Logger.contextsFilename = {
  [Logger.contexts.GLOBAL]: 'xud.log',
};

Logger.defaultLogDir = 'logs';

Logger.defaultLevel = process.env.NODE_ENV === 'production'
  ? Logger.levelsVal[Logger.levels.INFO]
  : Logger.levelsVal[Logger.levels.DEBUG];

Logger.global = new Logger({ context: Logger.contexts.GLOBAL });
module.exports = Logger;
