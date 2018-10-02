import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { UnBanRequest } from '../../proto/xudrpc_pb';

export const command = 'unban <node_pub_key>';

export const describe = 'unban a xud node';

export const builder = {
  node_pub_key: {
    description: 'nodePubKey of the node to unban',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new UnBanRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).unBan(request, callback);
};
