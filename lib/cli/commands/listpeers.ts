import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { ListPeersRequest } from '../../proto/xudrpc_pb';

export const command = 'listpeers';

export const describe = 'list connected peers';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).listPeers(new ListPeersRequest(), callback(argv));
};
