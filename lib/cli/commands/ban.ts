import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import { BanRequest } from '../../proto/xudrpc_pb';

export const command = 'ban <node_identifier>';

export const describe = 'ban a remote node';

export const builder = {
  node_identifier: {
    description: 'the node key or alias of the remote node to ban',
    type: 'string',
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new BanRequest();
  request.setNodeIdentifier(argv.node_identifier);
  loadXudClient(argv).ban(request, callback(argv));
};
