import { orderBuilder, orderHandler } from '../../utils';
import { Arguments, Argv } from 'yargs';

export const command = 'buy <quantity> <pair_id> <price> [order_id]';

export const describe = 'place a buy order';

export const builder = (argv: Argv) => orderBuilder(argv, 'buy');

export const handler = (argv: Arguments) => orderHandler(argv);
