import fs from 'fs';
import grpc from 'grpc';
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
  return (error: Error | null, response: GrpcResponse) => {
    if (error) {
      process.exitCode = 1;
      console.error(`${error.name}: ${error.message}`);
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
