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
  public static disabledLogger = new Logger({ disabled: true });

  private level: string;
  private context: Context;
  private logger?: winston.Logger;
  private instanceId: number;

  constructor({ level, filename, context, instanceId, disabled }:
    {instanceId?: number, level?: string, filename?: string, context?: Context, disabled?: boolean}) {

    this.level = level || Level.TRACE;
    this.context = context || Context.GLOBAL;
    this.instanceId = instanceId || 0;

    if (disabled) {
      return;
    }

    const transports: any[] = [
      new winston.transports.Console({
        level: this.level,
        format: this.getLogFormat(true),
      }),
    ];

    if (filename !== '') {
      transports.push(new winston.transports.File({
        filename,
        level: this.level,
        format: this.getLogFormat(false),
      }));
    }

    this.logger = winston.createLogger({
      transports,
      levels: LevelPriorities,
    });
  }

  public static createLoggers = (level: string, filename = '', instanceId = 0): Loggers => {
    const object = { instanceId, level, filename };
    return {
      global: new Logger({ ...object, context: Context.GLOBAL }),
      db: new Logger({ ...object, context: Context.DB }),
      rpc: new Logger({ ...object, context: Context.RPC }),
      p2p: new Logger({ ...object, context: Context.P2P }),
      orderbook: new Logger({ ...object, context: Context.ORDERBOOK }),
      lnd: new Logger({ ...object, context: Context.LND }),
      raiden: new Logger({ ...object, context: Context.RAIDEN }),
    };
  }

  private getLogFormat = (colorize: boolean) => {
    const { format } = winston;

    if (this.instanceId > 0) {
      return format.printf(info => `${getTsString()} [${this.context}][${this.instanceId}] ` +
        `${this.getLevel(info.level, colorize)}: ${info.message}`);
    } else {
      return format.printf(info => `${getTsString()} [${this.context}] ${this.getLevel(info.level, colorize)}: ${info.message}`);
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
    if (this.logger) {
      this.logger.log(level, msg);
    }
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
