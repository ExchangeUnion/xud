import { orderBuilder, orderHandler } from '../../utils';
import { Arguments, Argv } from 'yargs';

export const command = 'sell <quantity> <pair_id> <price> [order_id]';

export const describe = 'place a sell order';

export const builder = (argv: Argv) => orderBuilder(argv, 'sell');

export const handler = (argv: Arguments) => orderHandler(argv, true);
