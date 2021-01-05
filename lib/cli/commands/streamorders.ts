import { XudClient } from 'lib/proto/xudrpc_grpc_pb';
import { Arguments, Argv } from 'yargs';
import * as xudrpc from '../../proto/xudrpc_pb';
import { loadXudClient } from '../command';
import { onStreamError, waitForClient } from '../utils';

export const command = 'streamorders [existing]';

export const describe = 'stream order added, removed, and swapped events (DEMO)';

export const builder = (argv: Argv) =>
  argv.option('existing', {
    description: 'whether to return existing orders',
    type: 'boolean',
    default: true,
  });

export const handler = async (argv: Arguments) => {
  await ensureConnection(argv, true);
};

let client: XudClient;

const ensureConnection = async (argv: Arguments, printError?: boolean) => {
  if (!client) {
    client = await loadXudClient(argv);
  }

  waitForClient(client, argv, ensureConnection, streamOrders, printError);
};

const streamOrders = (argv: Arguments<any>) => {
  const ordersReqeust = new xudrpc.SubscribeOrdersRequest();
  ordersReqeust.setExisting(argv.existing);
  const ordersSubscription = client.subscribeOrders(ordersReqeust);
  ordersSubscription.on('data', (orderUpdate: xudrpc.OrderUpdate) => {
    if (orderUpdate.getOrder() !== undefined) {
      console.log(`Order added: ${JSON.stringify(orderUpdate.getOrder()!.toObject())}`);
    } else if (orderUpdate.getOrderRemoval() !== undefined) {
      console.log(`Order removed: ${JSON.stringify(orderUpdate.getOrderRemoval()!.toObject())}`);
    }
  });

  // adding end, close, error events only once,
  // since they'll be thrown for three of subscriptions in the corresponding cases, catching once is enough.
  ordersSubscription.on('end', reconnect.bind(undefined, argv));
  ordersSubscription.on('error', onStreamError.bind(undefined, ensureConnection.bind(undefined, argv)));

  const swapsRequest = new xudrpc.SubscribeSwapsRequest();
  swapsRequest.setIncludeTaker(true);
  const swapsSubscription = client.subscribeSwaps(swapsRequest);
  swapsSubscription.on('data', (swapSuccess: xudrpc.SwapSuccess) => {
    console.log(`Order swapped: ${JSON.stringify(swapSuccess.toObject())}`);
  });

  const swapsAcceptedRequest = new xudrpc.SubscribeSwapsAcceptedRequest();
  const swapsAcceptedSubscription = client.subscribeSwapsAccepted(swapsAcceptedRequest);
  swapsAcceptedSubscription.on('data', (swapAccepted: xudrpc.SwapAccepted) => {
    console.log(`Swap deal accepted: ${JSON.stringify(swapAccepted.toObject())}`);
  });

  const swapFailuresSubscription = client.subscribeSwapFailures(swapsRequest);
  swapFailuresSubscription.on('data', (swapFailure: xudrpc.SwapFailure) => {
    console.log(`Swap failed: ${JSON.stringify(swapFailure.toObject())}`);
  });

  // prevent exiting and do nothing, it's already caught above.
  swapsSubscription.on('error', () => {});
  swapsAcceptedSubscription.on('error', () => {});
  swapFailuresSubscription.on('error', () => {});
};

const reconnect = async (argv: Arguments) => {
  console.log('Stream has closed, trying to reconnect');
  await ensureConnection(argv, false);
};
