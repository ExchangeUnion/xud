import { expect } from 'chai';
import { formatOrders } from '../../lib/cli/commands/getorders';
import { GetOrdersResponse } from '../../lib/proto/xudrpc_pb';
import { createOrdersResponse } from '../factories';
import colors from 'colors/safe';

describe('Command.getorders.formatOrders', () => {
  it('should flatten, format and sort orders', () => {
    const BUY_ORDERS_COUNT = 5;
    const SELL_ORDERS_COUNT = 3;
    const jsonOrders: GetOrdersResponse.AsObject = createOrdersResponse(
      BUY_ORDERS_COUNT,
      SELL_ORDERS_COUNT,
    );
    const output = formatOrders(jsonOrders);
    const BUY_PRICE_INDEX = 1;
    const SELL_PRICE_INDEX = 4;
    // Shows 1 trading pair
    expect(output.length).to.equal(1);
    expect(output[0].pairId).to.equal('LTC/BTC');
    // Total of 5 rows
    const expectedRowCount = BUY_ORDERS_COUNT > SELL_ORDERS_COUNT
      ? BUY_ORDERS_COUNT
      : SELL_ORDERS_COUNT;
    expect(output[0].orders.length).to.equal(expectedRowCount);
    // Own orders are drawn in cyan
    const firstBuyFormatted = output[0].orders[0][BUY_PRICE_INDEX];
    const COLOR_CYAN = '\u001b[36m';
    expect(firstBuyFormatted).to.include(COLOR_CYAN);
    // Buy orders are sorted by highest price first
    const firstBuyPrice = parseFloat(colors.strip(firstBuyFormatted));
    const secondBuyPrice = parseFloat(colors.strip(output[0].orders[1][BUY_PRICE_INDEX]));
    expect(firstBuyPrice >= secondBuyPrice).to.equal(true);
    // Sell orders are sorted by lowest price first
    const firstSellPrice = parseFloat(colors.strip(output[0].orders[0][SELL_PRICE_INDEX]));
    const secondSellPrice = parseFloat(colors.strip(output[0].orders[1][SELL_PRICE_INDEX]));
    expect(firstSellPrice <= secondSellPrice).to.equal(true);
  });
});
