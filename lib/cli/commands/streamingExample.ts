import { loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { StreamingExampleRequest, StreamingExampleResponse } from '../../proto/xudrpc_pb';

export const command = 'stream';

export const describe = 'example for server-side streaming';

export const handler = (argv: Arguments) => {
  const request = new StreamingExampleRequest();
  const call = loadXudClient(argv).streamingExample(request);
  call.on('data', (message: StreamingExampleResponse) => {
    console.log(message.toObject());
  });
};
