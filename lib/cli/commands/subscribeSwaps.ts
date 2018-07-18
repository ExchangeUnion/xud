import { loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { SubscribeSwapsRequest, SubscribeSwapsResponse } from '../../proto/xudrpc_pb';

export const command = 'subscribeorders';

export const describe = 'subscribe to incoming peer orders';

export const handler = (argv: Arguments) => {
  const request = new SubscribeSwapsRequest();
  const call = loadXudClient(argv).subscribeSwaps(request);
  call.on('data', (message: SubscribeSwapsResponse) => {
    console.log(message.toObject());
  });
};
