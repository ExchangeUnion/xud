import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { RemoveBanRequest } from '../../proto/xudrpc_pb';

export const command = 'removeban <node_pub_key>';

export const describe = 'unban a xud node';

export const builder = {
  node_pub_key: {
    description: 'nodePubKey of the node to unban',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new RemoveBanRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).removeBan(request, callback);
};
