import { Arguments, Argv } from 'yargs';
import { callback, loadXudClient } from './command';
import { PlaceOrderRequest, PlaceOrderEvent, OrderSide, PlaceOrderResponse, Order, SwapResult } from '../proto/xudrpc_pb';

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
    let noMatches = true;
    subscription.on('data', (response: PlaceOrderEvent) => {
      if (argv.json) {
        console.log(JSON.stringify(response.toObject(), undefined, 2));
      } else {
        const internalMatch = response.getInternalMatch();
        const swapResult = response.getSwapResult();
        const remainingOrder = response.getRemainingOrder();
        if (internalMatch) {
          noMatches = false;
          formatInternalMatch(internalMatch.toObject());
        } else if (swapResult) {
          noMatches = false;
          formatSwapResult(swapResult.toObject());
        } else if (remainingOrder) {
          if (noMatches) {
            console.log('no matches found');
          }
          formatRemainingOrder(remainingOrder.toObject());
        }
      }
    });
  } else {
    loadXudClient(argv).placeOrderSync(request, callback(argv, formatPlaceOrderOutput));
  }
};

const formatPlaceOrderOutput = (response: PlaceOrderResponse.AsObject) => {
  const { internalMatchesList, swapResultsList, remainingOrder } = response;
  if (internalMatchesList.length === 0 && swapResultsList.length === 0) {
    console.log('no matches found');
  } else {
    internalMatchesList.forEach(formatInternalMatch);
    swapResultsList.forEach(formatSwapResult);
  }
  if (remainingOrder) {
    formatRemainingOrder(remainingOrder);
  }
};

const formatInternalMatch = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);
  console.log(`matched ${order.quantity} ${baseCurrency} @ ${order.price} with own order ${order.id}`);
};

const formatSwapResult = (swapResult: SwapResult.AsObject) => {
  const baseCurrency = getBaseCurrency(swapResult.pairId);
  console.log(`swapped ${swapResult.quantity} ${baseCurrency} with peer order ${swapResult.orderId}`);
};

const formatRemainingOrder = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);
  console.log(`remaining ${order.quantity} ${baseCurrency} entered the order book as ${order.id}`);
};

const getBaseCurrency = (pairId: string) => pairId.substring(0, pairId.indexOf('/'));
