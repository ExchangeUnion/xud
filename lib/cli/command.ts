import { Arguments } from 'yargs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import grpc from 'grpc';
import { XudClient } from '../proto/xudrpc_grpc_pb';

export const loadXudClient = (argv: Arguments) => {
  const getXudDir = () => {
    switch (os.platform()) {
      case 'win32': {
        const homeDir = process.env.LOCALAPPDATA!;
        return path.join(homeDir, 'Xud');
      }
      case 'darwin': {
        const homeDir = process.env.HOME!;
        return path.join(homeDir, '.xud');
      }
      default: {
        const homeDir = process.env.HOME!;
        return path.join(homeDir, '.xud');
      }
    }
  };

  const certPath = argv.tlscertpath ? argv.tlscertpath : path.join(getXudDir(), 'tls.cert');
  const cert = fs.readFileSync(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  return new XudClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

interface grpcResponse {
  toObject: Function;
}

/**
 * A generic function to instantiate an XU client, perform a command, and output the result to the
 * console.
 * @param argv the command line arguments
 * @param callback the callback function to perform a command
 */
export const callback = (formatOutput?: Function) => {
  return (error: Error | null, response: grpcResponse) => {
    if (error) {
      console.error(`${error.name}: ${error.message}`);
    } else {
      const responseObj = response.toObject();
      if (Object.keys(responseObj).length === 0) {
        console.log('success');
      } else {
        formatOutput
          ? formatOutput(responseObj)
          : console.log(JSON.stringify(responseObj, undefined, 2));
      }
    }
  };
};
