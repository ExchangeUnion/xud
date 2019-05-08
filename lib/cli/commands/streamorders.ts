import { loadXudClient } from '../command';
import { Arguments } from 'yargs';
import * as xudrpc from '../../proto/xudrpc_pb';
import { XudClient } from '../../proto/xudrpc_grpc_pb';

export const command = 'streamorders [existing]';

export const describe = 'stream order added, removed, and swapped events (DEMO)';

export const builder = {
  existing: {
    description: 'should return existing orders',
    type: 'boolean',
    default: true,
  },
};

export const handler = (argv: Arguments) => {
  ensureConnection(argv, true);
};

let xud: XudClient;

const ensureConnection = (argv: Arguments, printError?: boolean) => {
  if (!xud) xud = loadXudClient(argv);
  xud.waitForReady(Number.POSITIVE_INFINITY, (error: Error | null) => {
    if (error) {
      if (printError) console.error(`${error.name}: ${error.message}`);
      setTimeout(ensureConnection.bind(undefined, argv), 3000);
    } else {
      console.log('Successfully connected, subscribing for orders');
      streamOrders(argv);
    }
  });
};

const streamOrders = (argv: Arguments) =>  {
  const xudClient = loadXudClient(argv);
  const ordersReqeust = new xudrpc.SubscribeOrdersRequest();
  ordersReqeust.setExisting(argv.existing);
  const ordersSubscription = loadXudClient(argv).subscribeOrders(ordersReqeust);
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
  ordersSubscription.on('error', (err: Error) => {
    console.log(`Unexpected error occured: ${JSON.stringify(err)}, trying to reconnect`);
    ensureConnection(argv);
  });

  const swapsRequest = new xudrpc.SubscribeSwapsRequest();
  swapsRequest.setIncludeTaker(true);
  const swapsSubscription = xudClient.subscribeSwaps(swapsRequest);
  swapsSubscription.on('data', (swapSuccess: xudrpc.SwapSuccess) => {
    console.log(`Order swapped: ${JSON.stringify(swapSuccess.toObject())}`);
  });

  const swapFailuresSubscription = xudClient.subscribeSwapFailures(swapsRequest);
  swapFailuresSubscription.on('data', (swapFailure: xudrpc.SwapFailure) => {
    console.log(`Swap failed: ${JSON.stringify(swapFailure.toObject())}`);
  });

  // prevent exiting and do nothing, it's already caught above.
  swapsSubscription.on('error', () => {});
  swapFailuresSubscription.on('error', () => {});
};

const reconnect = (argv: Arguments) => {
  console.log('Stream has closed, trying to reconnect');
  ensureConnection(argv, false);
};
