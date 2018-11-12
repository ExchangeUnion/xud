import { Arguments, Argv } from 'yargs';
import { callback, loadXudClient } from './command';
import { PlaceOrderRequest, PlaceOrderEvent, OrderSide } from '../proto/xudrpc_pb';

export const orderBuilder = (argv: Argv, command: string) => argv
  .option('quantity', {
    type: 'number',
  })
  .option('pair_id', {
    type: 'string',
    describe: 'the trading pair ticker id for the order',
  })
  .option('price', {
    type: 'string',
    describe: 'the price for limit orders, or "mkt"/"market" for market orders',
  })
  .option('order_id', {
    type: 'string',
    describe: 'the local order id for this order',
  })
  .option('stream', {
    type: 'boolean',
    describe: 'whether to execute in streaming mode',
    default: false,
  })
  .example(`$0 ${command} 5 LTC/BTC .01 1337`, `place a limit order to ${command} 5 LTC @ 0.01 BTC with local order id 1337`)
  .example(`$0 ${command} 3 LTC/BTC mkt`, `place a market order to ${command} 3 LTC for BTC`)
  .example(`$0 ${command} 10 ZRX/GNT market`, `place a market order to ${command} 10 ZRX for GNT`);

export const orderHandler = (argv: Arguments, isSell = false) => {
  const request = new PlaceOrderRequest();

  const numericPrice = Number(argv.price);
  const priceStr = argv.price.toLowerCase();

  request.setQuantity(argv.quantity);
  request.setSide(isSell ? OrderSide.SELL : OrderSide.BUY);
  request.setPairId(argv.pair_id.toUpperCase());

  if (!isNaN(numericPrice)) {
    request.setPrice(numericPrice);
    if (argv.order_id) {
      request.setOrderId(argv.order_id);
    }
  } else if (priceStr !== ('mkt') && priceStr !== ('market')) {
    console.log('price must be numeric for limit orders or "mkt"/"market" for market orders');
    return;
  }

  if (argv.stream) {
    const subscription = loadXudClient(argv).placeOrder(request);
    subscription.on('data', (response: PlaceOrderEvent) => {
      console.log(JSON.stringify(response.toObject(), undefined, 2));
    });
  } else {
    loadXudClient(argv).placeOrderSync(request, callback(argv));
  }
};
