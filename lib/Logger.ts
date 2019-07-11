import winston from 'winston';
import colors from 'colors/safe';

import { getTsString } from './utils/utils';

enum Level {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Verbose = 'verbose',
  Debug = 'debug',
  Trace = 'trace',
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
  Global = 'GLOBAL',
  DB = 'DB',
  RPC = 'RPC',
  P2P = 'P2P',
  OrderBook = 'ORDERBOOK',
  Lnd = 'LND',
  Raiden = 'RAIDEN',
  Swaps = 'SWAPS',
  Http = 'HTTP',
}

type Loggers = {
  global: Logger,
  db: Logger,
  rpc: Logger,
  p2p: Logger,
  orderbook: Logger,
  lnd: Logger,
  raiden: Logger,
  swaps: Logger,
  http: Logger,
};

class Logger {
  public static readonly DISABLED_LOGGER = new Logger({ disabled: true });

  private level: string;
  private context: Context;
  private subcontext?: string;
  private logger?: winston.Logger;
  private filename?: string;
  private instanceId: number;
  private dateFormat?: string;

  constructor({
    level = Level.Trace,
    filename,
    context = Context.Global,
    subcontext,
    instanceId = 0,
    disabled,
    dateFormat,
  }: {
    instanceId?: number,
    level?: string,
    filename?: string,
    context?: Context,
    subcontext?: string,
    disabled?: boolean,
    dateFormat?: string,
  }) {
    this.level = level;
    this.context = context;
    this.subcontext = subcontext;
    this.instanceId = instanceId;
    this.dateFormat = dateFormat;

    if (disabled) {
      return;
    }

    const transports: any[] = [
      new winston.transports.Console({
        level: this.level,
        format: this.getLogFormat(true, dateFormat),
      }),
    ];

    if (filename) {
      this.filename = filename;
      transports.push(new winston.transports.File({
        filename,
        level: this.level,
        format: this.getLogFormat(false, dateFormat),
      }));
    }

    this.logger = winston.createLogger({
      transports,
      levels: LevelPriorities,
    });
  }

  public static createLoggers = (level: string, filename = '', instanceId = 0, dateFormat?: string): Loggers => {
    const object = { instanceId, level, filename, dateFormat };
    return {
      global: new Logger({ ...object, context: Context.Global }),
      db: new Logger({ ...object, context: Context.DB }),
      rpc: new Logger({ ...object, context: Context.RPC }),
      p2p: new Logger({ ...object, context: Context.P2P }),
      orderbook: new Logger({ ...object, context: Context.OrderBook }),
      lnd: new Logger({ ...object, context: Context.Lnd }),
      raiden: new Logger({ ...object, context: Context.Raiden }),
      swaps: new Logger({ ...object, context: Context.Swaps }),
      http: new Logger({ ...object, context: Context.Http }),
    };
  }

  public createSubLogger = (subcontext: string) => {
    return new Logger({
      subcontext,
      instanceId: this.instanceId,
      level: this.level,
      filename: this.filename,
      context: this.context,
      disabled: this.logger === undefined,
      dateFormat: this.dateFormat,
    });
  }

  private getLogFormat = (colorize: boolean, dateFormat?: string) => {
    const { format } = winston;

    const context = this.subcontext ? `${this.context}-${this.subcontext}` : this.context;
    if (this.instanceId > 0) {
      return format.printf(info => `${getTsString(dateFormat)} [${context}][${this.instanceId}] ` +
        `${this.getLevel(info.level, colorize)}: ${info.message}`);
    } else {
      return format.printf(info => `${getTsString(dateFormat)} [${context}] ${this.getLevel(info.level, colorize)}: ${info.message}`);
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

  public error = (msg: Error | string, err?: any) => {
    let errMsg: string;
    if (msg instanceof Error) {
      // treat msg as an error object
      errMsg = msg.stack ? msg.stack : `${msg.name} - ${msg.message}`;
    } else {
      errMsg = msg;
      if (err) {
        errMsg += ': ';
        if (err instanceof Error) {
          errMsg += err.stack ? err.stack : `${err.name} - ${err.message}`;
        } else if (err.code && err.message) {
          errMsg += `${err.code} - ${err.message}`;
        } else {
          errMsg += JSON.stringify(err);
        }
      }
    }

    this.log(Level.Error, errMsg);
  }

  public warn = (msg: string) => {
    this.log(Level.Warn, msg);
  }

  public info = (msg: string) => {
    this.log(Level.Info, msg);
  }

  public verbose = (msg: string) => {
    this.log(Level.Verbose, msg);
  }

  public debug = (msg: string) => {
    this.log(Level.Debug, msg);
  }

  public trace = (msg: string) => {
    this.log(Level.Trace, msg);
  }
}

export default Logger;
export { Level, Loggers };
