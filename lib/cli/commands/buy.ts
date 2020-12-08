import { Arguments, Argv } from 'yargs';
import { OrderSide } from '../../proto/xudrpc_pb';
import { placeOrderBuilder, placeOrderHandler } from '../placeorder';

export const command = 'buy <quantity> <pair_id> <price> [order_id]';

export const describe = 'place a buy order';

export const builder = (argv: Argv) => placeOrderBuilder(argv, OrderSide.BUY);

export const handler = async (argv: Arguments) => placeOrderHandler(argv, OrderSide.BUY);
