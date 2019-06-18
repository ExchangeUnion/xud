import { Arguments } from 'yargs';
import fs from 'fs';
import os from 'os';
import path from 'path';
import grpc from 'grpc';
import { XudClient, XudInitClient } from '../proto/xudrpc_grpc_pb';

function getXudDir() {
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
}

/**
 * A generic function to instantiate an XU client.
 * @param argv the command line arguments
 */
export const loadXudClient = (argv: Arguments) => {
  const certPath = argv.tlscertpath ? argv.tlscertpath : path.join(getXudDir(), 'tls.cert');
  const cert = fs.readFileSync(certPath);
  const credentials = grpc.credentials.createSsl(cert);

  return new XudClient(`${argv.rpchost}:${argv.rpcport}`, credentials);
};

export const loadXudInitClient = (argv: Arguments) => {
  const certPath = argv.tlscertpath ? argv.tlscertpath : path.join(getXudDir(), 'tls.cert');
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
