import { Arguments } from 'yargs';
import grpc from 'grpc';
import { XudClient } from '../proto/xudrpc_grpc_pb';

export const loadXudClient = (argv: Arguments) => {
  // TODO load saved cert from disk
  const credentials = grpc.credentials.createInsecure();
  return new XudClient(`${argv.rpc.host}:${argv.rpc.port}`, credentials);
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
export const callback = (error: Error | null, response: grpcResponse) => {
  if (error) {
    console.error(`${error.name}: ${error.message}`);
  } else {
    console.log(JSON.stringify(response.toObject(), undefined, 2));
  }
};
