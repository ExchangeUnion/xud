'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
const util = require('./utils/util');

class Logger {

  constructor({level, logDir, context}) {
    this.level = level || Logger.defaultLevel;
    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Logger.contexts.GLOBAL;
    this._bind();

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir)
    }
    winston.configure({
      transports: [
        new (winston.transports.Console)({
          timestamp: util.getTsString,
          colorize: true,
        }),
        new (winston.transports.File)({
          filename: path.join(this.logDir, Logger.contextsFilename[this.context]),
          timestamp: util.getTsString,
        }),
      ],
    });

    winston.level = this.level;
  }

  _bind() {
    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.debug = this.debug.bind(this);
  }

  _log(level, msg) {
    winston.log(level, msg);
  }

  error(msg, err) {
    this._log(Logger.levelsVal[Logger.levels.ERROR], `${msg}\n Error: ${err}`);
  }

  warn(msg) {
    this._log(Logger.levelsVal[Logger.levels.WARN], msg);
  }

  info(msg) {
    this._log(Logger.levelsVal[Logger.levels.INFO], msg);
  }

  debug(msg) {
    this._log(Logger.levelsVal[Logger.levels.DEBUG], msg);
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
  [Logger.levels.DEBUG]: 'debug'
};

Logger.contexts = {
  GLOBAL: 0
};

Logger.contextsFilename = {
  [Logger.contexts.GLOBAL]: 'xunion.log'
};

Logger.defaultLogDir = 'logs';

Logger.defaultLevel = process.env.NODE_ENV === 'production'
  ? Logger.levelsVal[Logger.levels.INFO]
  : Logger.levelsVal[Logger.levels.DEBUG];

Logger.global = new Logger({context: Logger.contexts.GLOBAL});
module.exports = Logger;
