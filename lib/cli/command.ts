import fs from 'fs';
import grpc, { status } from 'grpc';
import { Arguments } from 'yargs';
import { XudClient, XudInitClient } from '../proto/xudrpc_grpc_pb';
import { getDefaultCertPath } from './utils';

/**
 * A generic function to instantiate an XU client.
 * @param argv the command line arguments
 */
export const loadXudClient = (argv: Arguments<any>) => {
  const certPath = argv.tlscertpath || getDefaultCertPath();
  const cert = fs.readFileSync(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  return new XudClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

export const loadXudInitClient = (argv: Arguments<any>) => {
  const certPath = argv.tlscertpath || getDefaultCertPath();
  const cert = fs.readFileSync(certPath);
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
      if (error.code === status.UNAVAILABLE) {
        if (error.message.includes('xud is starting')) {
          console.error('xud is starting... try again in a few seconds');
        } else {
          console.error(`could not connect to xud at ${argv.rpchost}:${argv.rpcport}, is xud running?`);
        }
      } else if (error.code === status.UNIMPLEMENTED && error.message.includes('xud is locked')) {
        console.error("xud is locked, run 'xucli unlock' or 'xucli create' then try again");
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
