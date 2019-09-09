import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { BanRequest } from '../../proto/xudrpc_pb';

export const command = 'ban <node_key>';

export const describe = 'ban a peer';

export const builder = {
  node_key: {
    description: 'the node key of the peer to ban',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new BanRequest();
  request.setNodePubKey(argv.node_key);
  loadXudClient(argv).ban(request, callback(argv));
};
