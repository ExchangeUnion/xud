import fs from 'fs';
import path from 'path';
import winston from 'winston';
import colors from 'colors/safe';

import { getTsString } from './utils/utils';

enum Level {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  TRACE = 'trace',
}

const LevelPriorities = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  trace: 5,
};

export enum Context {
  GLOBAL = 'GLOBAL',
  DB = 'DB',
  RPC = 'RPC',
  P2P = 'P2P',
  ORDERBOOK = 'ORDERBOOK',
  LND = 'LND',
  RAIDEN = 'RAIDEN',
}

const contextFileMap = {
  [Context.GLOBAL]: 'xud.log',
  [Context.DB]: 'xud.log',
  [Context.RPC]: 'xud.log',
  [Context.P2P]: 'xud.log',
  [Context.ORDERBOOK]: 'xud.log',
  [Context.LND]: 'xud.log',
  [Context.RAIDEN]: 'xud.log',
};

type Loggers = {
  global: Logger,
  db: Logger,
  rpc: Logger,
  p2p: Logger,
  orderbook: Logger,
  lnd: Logger,
  raiden: Logger,
};

class Logger {
  private level: string;
  private logDir: string;
  private context: Context;
  private logger: any;
  private instanceId: number;

  private static defaultLogDir = 'logs';

  constructor({ level, instanceId, logDir, context }: {level: string, instanceId?: number, logDir?: string, context: Context}) {
    this.level = level;

    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Context.GLOBAL;
    this.instanceId = instanceId || 0;

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
    this.logger = winston.createLogger({
      levels: LevelPriorities,
      transports: [
        new winston.transports.Console({
          level: this.level,
          colorize: true,
          format: this.getLogFormat(true),
        }),
        new winston.transports.File({
          level: this.level,
          filename: path.join(this.logDir, contextFileMap[this.context]),
          format: this.getLogFormat(false),
        }),
      ],
    });
  }

  public static createLoggers = (level: string, instanceId = 0): Loggers => {
    return {
      global: new Logger({ instanceId, level, context: Context.GLOBAL }),
      db: new Logger({ instanceId, level, context: Context.DB }),
      rpc: new Logger({ instanceId, level, context: Context.RPC }),
      p2p: new Logger({ instanceId, level, context: Context.P2P }),
      orderbook: new Logger({ instanceId, level, context: Context.ORDERBOOK }),
      lnd: new Logger({ instanceId, level, context: Context.LND }),
      raiden: new Logger({ instanceId, level, context: Context.RAIDEN }),
    };
  }

  private getLogFormat = (colorize: boolean) => {
    const { format } = winston;

    if (this.instanceId > 0) {
      return format.printf((info: any) => `${getTsString()} [${this.context}][${this.instanceId}]` +
        `${this.getLevel(info.level, colorize)}: ${info.message}`);
    } else {
      return format.printf((info: any) => `${getTsString()} [${this.context}] ${this.getLevel(info.level, colorize)}: ${info.message}`);
    }
  }

  private getLevel = (level: string, colorize: boolean): string => {
    if (colorize) {
      switch (level) {
        case 'error': return colors.red(level);
        case 'warn': return colors.yellow(level);
        case 'info': return colors.green(level);
        case 'verbose': return colors.cyan(level);
        case 'debug': return colors.blue(level);
        case 'trace': return colors.magenta(level);
      }
    }
    return level;
  }

  private log = (level: string, msg: string) => {
    this.logger.log(level, msg);
  }

  public error = (msg: Error | string, err?: Error) => {
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

  public warn = (msg: string) => {
    this.log(Level.WARN, msg);
  }

  public info = (msg: string) => {
    this.log(Level.INFO, msg);
  }

  public verbose = (msg: string) => {
    this.log(Level.VERBOSE, msg);
  }

  public debug = (msg: string) => {
    this.log(Level.DEBUG, msg);
  }

  public trace = (msg: string) => {
    this.log(Level.TRACE, msg);
  }
}

export default Logger;
export { Level };
