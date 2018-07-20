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

class Logger {
  private level: string;
  private logDir: string;
  private context: Context;
  private logger: any;
  public instanceId: number;

  private static defaultLogDir = 'logs';

  private static defaultLevel = process.env.NODE_ENV === 'production'
  ? Level.INFO
  : Level.DEBUG;

  public static p2p = new Logger({ context: Context.P2P, instanceId:1 });
  public static orderbook = new Logger({ context: Context.ORDERBOOK, instanceId:1 });
  public static lnd = new Logger({ context: Context.LND, instanceId:1 });
  public static raiden = new Logger({ context: Context.RAIDEN, instanceId:1 });

  constructor({ instanceId, level, logDir, context }: {instanceId?: number, level?: string, logDir?: string, context: Context}) {
    this.level = level || Logger.defaultLevel;
    this.logDir = logDir || Logger.defaultLogDir;
    this.context = context || Context.GLOBAL;
    this.instanceId = instanceId || 0;

    const { format } = winston;
    let logFormat: any;
    if (this.instanceId > 0) {
      logFormat = format.printf(info => `${getTsString()} [${this.context}][${this.instanceId}] ${info.level}: ${info.message}`);
    } else {
      logFormat = format.printf(info => `${getTsString()} [${this.context}] ${info.level}: ${info.message}`);
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
