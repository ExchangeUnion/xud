import { Arguments, Argv } from 'yargs';
import { OrderSide } from '../../proto/xudrpc_pb';
import { placeOrderBuilder, placeOrderHandler } from '../placeorder';

export const command = 'sell <quantity> <pair_id> <price> [order_id] [stream] [replace_order_id]';

export const describe = 'place a sell order';

export const builder = (argv: Argv) => placeOrderBuilder(argv, OrderSide.SELL);

export const handler = (argv: Arguments) => placeOrderHandler(argv, OrderSide.SELL);
