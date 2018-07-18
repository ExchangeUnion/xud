import { loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { SubscribePeerOrdersRequest, SubscribePeerOrdersResponse } from '../../proto/xudrpc_pb';

export const command = 'subscribepeerorders';

export const describe = 'subscribe to incoming peer orders';

export const handler = (argv: Arguments) => {
  const request = new SubscribePeerOrdersRequest();
  const call = loadXudClient(argv).subscribePeerOrders(request);
  call.on('data', (message: SubscribePeerOrdersResponse) => {
    console.log(message.toObject());
  });
};
