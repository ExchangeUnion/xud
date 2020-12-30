import { Arguments, Argv } from 'yargs';
import { XudClient } from 'lib/proto/xudrpc_grpc_pb';
import {
  Order,
  OrderSide,
  PlaceOrderEvent,
  PlaceOrderRequest,
  PlaceOrderResponse,
  SwapFailure,
  SwapSuccess,
} from '../proto/xudrpc_pb';
import { callback, loadXudClient } from './command';
import { coinsToSats, satsToCoinsStr } from './utils';
import { checkDecimalPlaces } from '../utils/utils';

export const placeOrderBuilder = (argv: Argv, side: OrderSide) => {
  const command = side === OrderSide.BUY ? 'buy' : 'sell';
  argv
    .positional('quantity', {
      type: 'number',
      describe: 'the quantity to trade',
    })
    .positional('pair_id', {
      type: 'string',
      describe: 'the trading pair ticker id for the order',
    })
    .positional('price', {
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
    .example(
      `$0 ${command} 5 LTC/BTC .01 1337`,
      `place a limit order to ${command} 5 LTC @ 0.01 BTC with local order id 1337`,
    )
    .example(`$0 ${command} 3 BTC/USDT mkt`, `place a market order to ${command} 3 BTC for USDT`)
    .example(`$0 ${command} 1 BTC/USDT market`, `place a market order to ${command} 1 BTC for USDT`);
};

export const placeOrderHandler = async (argv: Arguments<any>, side: OrderSide) => {
  const request = new PlaceOrderRequest();

  const numericPrice = Number(argv.price);
  const priceStr = argv.price.toLowerCase();

  const quantity = coinsToSats(argv.quantity);
  request.setQuantity(quantity);
  request.setSide(side);
  request.setPairId(argv.pair_id.toUpperCase());
  request.setImmediateOrCancel(argv.ioc);

  if (!isNaN(numericPrice)) {
    request.setPrice(numericPrice);
    if (argv.order_id) {
      request.setOrderId(argv.order_id);
    }
  } else if (priceStr !== 'mkt' && priceStr !== 'market') {
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

  const client = ((await loadXudClient(argv)) as unknown) as XudClient;
  if (argv.sync) {
    client.placeOrderSync(request, callback(argv, formatPlaceOrderOutput));
  } else {
    const subscription = client.placeOrder(request);
    let noMatches = true;
    let remainingQuantity = quantity;
    subscription.on('data', (response: PlaceOrderEvent) => {
      if (argv.json) {
        console.log(JSON.stringify(response.toObject(), undefined, 2));
      } else {
        const orderMatch = response.getMatch();
        const swapSuccess = response.getSwapSuccess();
        const remainingOrder = response.getRemainingOrder();
        const swapFailure = response.getSwapFailure();
        if (orderMatch) {
          noMatches = false;
          if (orderMatch.getIsOwnOrder()) {
            remainingQuantity -= orderMatch.getQuantity();
            formatInternalMatch(orderMatch.toObject());
          } else {
            formatPeerMatch(orderMatch.toObject());
          }
        } else if (swapSuccess) {
          noMatches = false;
          remainingQuantity -= swapSuccess.getQuantity();
          formatSwapSuccess(swapSuccess.toObject());
        } else if (remainingOrder) {
          formatRemainingOrder(remainingOrder.toObject());
          remainingQuantity = 0;
        } else if (swapFailure) {
          formatSwapFailure(swapFailure.toObject());
        }
      }
    });
    subscription.on('end', () => {
      if (noMatches) {
        console.log('no matches found');
      } else if (remainingQuantity > 0) {
        console.log(`no more matches found, ${satsToCoinsStr(remainingQuantity)} qty will be discarded`);
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

const formatPeerMatch = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);

  console.log(
    `matched ${satsToCoinsStr(order.quantity)} ${baseCurrency} @ ${order.price} with peer ${
      order.nodeIdentifier!.alias
    } order ${order.id}, attempting swap...`,
  );
};

const formatSwapSuccess = (swapSuccess: SwapSuccess.AsObject) => {
  const baseCurrency = getBaseCurrency(swapSuccess.pairId);
  console.log(
    `successfully swapped ${satsToCoinsStr(swapSuccess.quantity)} ${baseCurrency} with peer order ${
      swapSuccess.orderId
    }`,
  );
};

const formatSwapFailure = (swapFailure: SwapFailure.AsObject) => {
  const baseCurrency = getBaseCurrency(swapFailure.pairId);
  console.log(
    `failed to swap ${satsToCoinsStr(swapFailure.quantity)} ${baseCurrency} due to ${
      swapFailure.failureReason
    } with peer order ${swapFailure.orderId}, continuing with matching routine...`,
  );
};

const formatRemainingOrder = (order: Order.AsObject) => {
  const baseCurrency = getBaseCurrency(order.pairId);
  console.log(`remaining ${satsToCoinsStr(order.quantity)} ${baseCurrency} entered the order book as ${order.id}`);
};

const getBaseCurrency = (pairId: string) => pairId.substring(0, pairId.indexOf('/'));
