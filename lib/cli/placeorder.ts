import { Arguments, Argv } from 'yargs';
import { Order, OrderSide, PlaceOrderEvent, PlaceOrderRequest, PlaceOrderResponse, SwapFailure, SwapSuccess } from '../proto/xudrpc_pb';
import { callback, loadXudClient } from './command';
import { coinsToSats, satsToCoinsStr } from './utils';
import { checkDecimalPlaces } from '../utils/utils';

export const placeOrderBuilder = (argv: Argv, side: OrderSide) => {
  const command = side === OrderSide.BUY ? 'buy' : 'sell';
  argv.option('quantity', {
    type: 'number',
    describe: 'the quantity to trade',
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
  .option('sync', {
    type: 'boolean',
    describe: 'prints the outcome all at once when matching completes',
    alias: 's',
    default: false,
  })
  .option('replace_order_id', {
    type: 'string',
    alias: 'r',
    describe: 'the local order id of a previous order to be replaced',
  })
  .option('ioc', {
    type: 'boolean',
    alias: 'i',
    describe: 'immediate-or-cancel',
  })
  .example(`$0 ${command} 5 LTC/BTC .01 1337`, `place a limit order to ${command} 5 LTC @ 0.01 BTC with local order id 1337`)
  .example(`$0 ${command} 3 LTC/BTC mkt`, `place a market order to ${command} 3 LTC for BTC`)
  .example(`$0 ${command} 10 ZRX/GNT market`, `place a market order to ${command} 10 ZRX for GNT`);
};

export const placeOrderHandler = async (argv: Arguments<any>, side: OrderSide) => {
  const request = new PlaceOrderRequest();

  const numericPrice = Number(argv.price);
  const priceStr = argv.price.toLowerCase();

  request.setQuantity(coinsToSats(argv.quantity));
  request.setSide(side);
  request.setPairId(argv.pair_id.toUpperCase());
  request.setImmediateOrCancel(argv.ioc);

  if (!isNaN(numericPrice)) {
    request.setPrice(numericPrice);
    if (argv.order_id) {
      request.setOrderId(argv.order_id);
    }
  } else if (priceStr !== ('mkt') && priceStr !== ('market')) {
    console.log('price must be numeric for limit orders or "mkt"/"market" for market orders');
    return;
  }

  if (checkDecimalPlaces(numericPrice)) {
    process.exitCode = 1;
    console.error('price cannot have more than 12 decimal places');
    return;
  }

  if (argv.replace_order_id) {
    request.setReplaceOrderId(argv.replace_order_id);
  }

  const client = await loadXudClient(argv);
  if (argv.sync) {
    client.placeOrderSync(request, callback(argv, formatPlaceOrderOutput));
  } else {
    const subscription = client.placeOrder(request);
    let noMatches = true;
    subscription.on('data', (response: PlaceOrderEvent) => {
      if (argv.json) {
        console.log(JSON.stringify(response.toObject(), undefined, 2));
      } else {
        const internalMatch = response.getInternalMatch();
        const swapSuccess = response.getSwapSuccess();
        const remainingOrder = response.getRemainingOrder();
        const swapFailure = response.getSwapFailure();
        if (internalMatch) {
          noMatches = false;
          formatInternalMatch(internalMatch.toObject());
        } else if (swapSuccess) {
          noMatches = false;
          formatSwapSuccess(swapSuccess.toObject());
        } else if (remainingOrder) {
          formatRemainingOrder(remainingOrder.toObject());
        } else if (swapFailure) {
          formatSwapFailure(swapFailure.toObject());
        }
      }
    });
    subscription.on('end', () => {
      if (noMatches) {
        console.log('no matches found');
      }
    });
    subscription.on('error', (err) => {
      process.exitCode = 1;
      console.error(err.message);
    });
  }
};

const formatPlaceOrderOutput = (response: PlaceOrderResponse.AsObject) => {
  const { internalMatchesList, swapSuccessesList, swapFailuresList, remainingOrder } = response;
  if (internalMatchesList.length === 0 && swapSuccessesList.length === 0 && swapFailuresList.length === 0) {
    console.log('no matches found');
  } else {
    internalMatchesList.forEach(formatInternalMatch);
    swapSuccessesList.forEach(formatSwapSuccess);
    swapFailuresList.forEach(formatSwapFailure);
  }
  if (remainingOrder) {
    formatRemainingOrder(remainingOrder);
  }
};

const formatInternalMatch = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);
  console.log(`matched ${satsToCoinsStr(order.quantity)} ${baseCurrency} @ ${order.price} with own order ${order.id}`);
};

const formatSwapSuccess = (swapSuccess: SwapSuccess.AsObject) => {
  const baseCurrency = getBaseCurrency(swapSuccess.pairId);
  console.log(`swapped ${satsToCoinsStr(swapSuccess.quantity)} ${baseCurrency} with peer order ${swapSuccess.orderId}`);
};

const formatSwapFailure = (swapFailure: SwapFailure.AsObject) => {
  const baseCurrency = getBaseCurrency(swapFailure.pairId);
  console.log(`failed to swap ${satsToCoinsStr(swapFailure.quantity)} ${baseCurrency} with peer order ${swapFailure.orderId}`);
};

const formatRemainingOrder = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);
  console.log(`remaining ${satsToCoinsStr(order.quantity)} ${baseCurrency} entered the order book as ${order.id}`);
};

const getBaseCurrency = (pairId: string) => pairId.substring(0, pairId.indexOf('/'));
