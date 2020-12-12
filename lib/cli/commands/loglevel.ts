import { Arguments, Argv } from 'yargs';
import { LogLevel, SetLogLevelRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { LevelPriority } from '../../Logger';

export const command = 'loglevel <level>';

export const describe = 'set the logging level for xud';

export const builder = (argv: Argv) =>
  argv
    .positional('level', {
      description: 'the logging level',
      type: 'string',
      choices: ['alert', 'error', 'warn', 'verbose', 'info', 'debug', 'trace'],
      coerce: (logLevelStr: string) => {
        const logLevelLower = logLevelStr.toLowerCase();
        return logLevelLower;
      },
    })
    .example('$0 loglevel trace', 'set log level to trace')
    .example('$0 loglevel info', 'set log level to info');

export const handler = async (argv: Arguments<any>) => {
  const request = new SetLogLevelRequest();
  const levelPriority = (LevelPriority[argv.level] as unknown) as number;
  const logLevel: LogLevel = levelPriority as LogLevel;
  request.setLogLevel(logLevel);
  (await loadXudClient(argv)).setLogLevel(request, callback(argv));
};
