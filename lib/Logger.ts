import fs from 'fs';
import path from 'path';
import winston from 'winston';

import { getTsString } from './utils/utils';

enum Level {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
}

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

  private static defaultLevel = process.env.NODE_ENV === 'production'
  ? Level.INFO
  : Level.DEBUG;

  constructor({ instanceId, level, logDir, context }: {instanceId?: number, level?: string, logDir?: string, context: Context}) {
    this.level = level || Logger.defaultLevel;
    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Context.GLOBAL;
    this.instanceId = instanceId || 0;

    const { format } = winston;
    let logFormat: any;
    if (this.instanceId > 0) {
      logFormat = format.printf((info: any) => `${getTsString()} [${this.context}][${this.instanceId}] ${info.level}: ${info.message}`);
    } else {
      logFormat = format.printf((info: any) => `${getTsString()} [${this.context}] ${info.level}: ${info.message}`);
    }
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

  public static createLoggers = (instanceId = 0): Loggers => {
    return {
      global: new Logger({ instanceId, context: Context.GLOBAL }),
      db: new Logger({ instanceId, context: Context.DB }),
      rpc: new Logger({ instanceId, context: Context.RPC }),
      p2p: new Logger({ instanceId, context: Context.P2P }),
      orderbook: new Logger({ instanceId, context: Context.ORDERBOOK }),
      lnd: new Logger({ instanceId, context: Context.LND }),
      raiden: new Logger({ instanceId, context: Context.RAIDEN }),
    };
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
}

export default Logger;
