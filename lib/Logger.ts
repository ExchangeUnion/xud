import fs from 'fs';
import path from 'path';
import winston from 'winston';

import utils from './utils/utils';

enum Level {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
}

enum Context {
  GLOBAL,
}

const contextFileMap = {
  [Context.GLOBAL]: 'xud.log',
};

class Logger {
  level: string;
  logDir: string;
  context: Context;
  logger: any;

  static defaultLogDir = 'logs';

  static defaultLevel = process.env.NODE_ENV === 'production'
  ? Level.INFO
  : Level.DEBUG;

  static global = new Logger({ context: Context.GLOBAL, logDir: undefined, level: undefined });

  constructor({ level, logDir, context }: { level?: string, logDir?: string, context: Context}) {
    this.level = level || Logger.defaultLevel;
    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Context.GLOBAL;

    const { format } = winston;
    const logFormat = format.printf(
        info => `${utils.getTsString(info.timestamp)} ${info.level}: ${info.message}`);

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
    this.logger = winston.createLogger({
      level: this.level,
      format: logFormat,
      transports: [
        new winston.transports.Console({ format: format.combine(format.colorize(), logFormat) }),
        new winston.transports.File({
          filename: path.join(this.logDir, contextFileMap[this.context]),
        }),
      ],
    });
  }

  log = (level: string, msg: string) => {
    this.logger.log(level, msg);
  }

  error = (msg: Error | string, err?: Error) => {
    let errMsg: string;
    if (msg instanceof Error) {
      // treat msg as an error object
      errMsg = msg.stack ? msg.stack : '';
    } else if (err) {
      errMsg = `${msg} ${err.stack}`;
    } else {
      errMsg = msg;
    }
    this.log(Level.ERROR, errMsg);
  }

  warn = (msg: string) => {
    this.log(Level.WARN, msg);
  }

  info = (msg: string) => {
    this.log(Level.INFO, msg);
  }

  verbose = (msg: string) => {
    this.log(Level.VERBOSE, msg);
  }

  debug = (msg: string) => {
    this.log(Level.DEBUG, msg);
  }
}
export default Logger;
