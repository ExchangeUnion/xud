import fs from 'fs';
import grpc, { status } from 'grpc';
import path from 'path';
import { Arguments } from 'yargs';
import Config from '../Config';
import { XudClient, XudInitClient } from '../proto/xudrpc_grpc_pb';

/**
 * A generic function to instantiate an XU client.
 * @param argv the command line arguments
 */
export const loadXudClient = async (argv: Arguments<any>) => {
  const config = new Config();
  await config.load({
    xudir: argv.xudir,
    rpc: {
      port: argv.rpcport,
      host: argv.rpchost,
    },
  });

  const certPath = argv.tlscertpath || path.join(config.xudir, 'tls.cert');
  const cert = fs.readFileSync(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  // in case port and host args were not set, we update them to the values we
  // determined by loading the config
  argv.rpcport = config.rpc.port;
  argv.rpchost = config.rpc.host;

  return new XudClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

export const loadXudInitClient = async (argv: Arguments<any>) => {
  const config = new Config();
  await config.load({
    xudir: argv.xudir,
    rpc: {
      port: argv.rpcport,
      host: argv.rpchost,
    },
  });

  const certPath = argv.tlscertpath || path.join(config.xudir, 'tls.cert');
  const cert = fs.readFileSync(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  // in case port and host args were not set, we update them to the values we
  // determined by loading the config
  argv.rpcport = config.rpc.port;
  argv.rpchost = config.rpc.host;

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
      if (Object.keys(responseObj).length === 0) {
        console.log('success');
      } else {
        if (!argv.json && formatOutput) {
          formatOutput(responseObj, argv);
        } else {
          displayJson
            ? displayJson(responseObj, argv)
            : console.log(JSON.stringify(responseObj, undefined, 2));
        }
      }
    }
  };
};
