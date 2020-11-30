import fs from 'fs';
import grpc, { status } from 'grpc';
import path from 'path';
import { Arguments } from 'yargs';
import Config from '../Config';
import { XudClient, XudInitClient } from '../proto/xudrpc_grpc_pb';

/**
 * Attempts to load the xud configuration file to dynamically determine the
 * port and interface that xud is listening for rpc calls on as well as the
 * tls cert path, if arguments specifying these parameters were not provided.
 * @param argv the command line arguments
 */
const loadXudConfig = async (argv: Arguments<any>) => {
  const config = new Config();
  try {
    await config.load({
      xudir: argv.xudir,
      rpc: {
        port: argv.rpcport,
        host: argv.rpchost,
      },
    });
  } catch (err) {
    // if we can't load the config file, we should alert the user but continue
    // on to attempt the call with the commands args or default config values
    console.error(err);
  }

  // for any args that were not set, we update them to the values we
  // determined by loading the config
  argv.xudir = argv.xudir ?? config.xudir;
  argv.rpcport = argv.rpcport ?? config.rpc.port;
  if (argv.rpchost === undefined) {
    argv.rpchost = (config.rpc.host === '0.0.0.0' || config.rpc.host === '::') ?
      'localhost' : // if xud is listening on any address, try reaching it with localhost
      config.rpc.host;
  }
};

const getTlsCert = (certPath: string) => {
  try {
    return fs.readFileSync(certPath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw `tls cert could not be found at ${certPath}, it may take several seconds to be created on xud's first run`;
    }

    throw err;
  }
};

/**
 * A generic function to instantiate an XU client.
 * @param argv the command line arguments
 */
export const loadXudClient = async (argv: Arguments<any>) => {
  await loadXudConfig(argv);

  const certPath = argv.tlscertpath || path.join(argv.xudir, 'tls.cert');
  const cert = getTlsCert(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  return new XudClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

export const loadXudInitClient = async (argv: Arguments<any>) => {
  await loadXudConfig(argv);

  const certPath = argv.tlscertpath || path.join(argv.xudir, 'tls.cert');
  const cert = getTlsCert(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  return new XudInitClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

interface GrpcResponse {
  toObject: Function;
}

export const callback = (argv: Arguments, formatOutput?: Function, displayJson?: Function) => {
  return (error: grpc.ServiceError | null, response: GrpcResponse) => {
    if (error) {
      process.exitCode = 1;
      if (error.code === status.UNAVAILABLE && error.message.includes('xud is starting')) {
        console.error('xud is starting... try again in a few seconds');
      } else if (error.details === 'failed to connect to all addresses') {
        console.error(`could not connect to xud at ${argv.rpchost}:${argv.rpcport}, is xud running?`);
      } else if (error.code === status.UNIMPLEMENTED && error.message.includes('xud is locked')) {
        console.error("xud is locked, run 'xucli unlock', 'xucli create', or 'xucli restore' then try again");
      } else if (error.code === status.UNIMPLEMENTED && error.message.includes('xud node cannot be created because it already exists')) {
        console.error("an xud node already exists, try unlocking it with 'xucli unlock'");
      } else if (error.code === status.UNIMPLEMENTED && error.message.includes('xud node cannot be unlocked because it does not exist')) {
        console.error("no xud node exists to unlock, try creating one with 'xucli create' or 'xucli restore'");
      } else if (error.code === status.UNIMPLEMENTED && error.message.includes('xud init service is disabled')) {
        console.error("xud is running and unlocked, try checking its status with 'xucli getinfo'");
      } else {
        console.error(`${error.name}: ${error.message}`);
      }
    } else {
      const responseObj = response.toObject();
      if (argv.json || !formatOutput) {
        if (Object.keys(responseObj).length === 0) {
          console.log('success');
        } else {
          displayJson
          ? displayJson(responseObj, argv)
          : console.log(JSON.stringify(responseObj, undefined, 2));
        }
      } else {
        formatOutput(responseObj, argv);
      }
    }
  };
};
