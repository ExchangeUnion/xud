import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { DisconnectRequest } from '../../proto/xudrpc_pb';

export const command = 'disconnect <node_pub_key>';

export const describe = 'disconnect from an xu node';

export const builder = {
  node_pub_key: {
    description: 'nodePubKey of peer to disconnect',
    type: 'string',
  },
};

export const handler = (argv: Arguments) => {
  const request = new DisconnectRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).disconnect(request, callback);
};
