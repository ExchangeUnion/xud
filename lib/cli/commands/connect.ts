import { Arguments, Argv } from 'yargs';
import { ConnectRequest } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';

export const command = 'connect <node_uri>';

export const describe = 'connect to a remote node';

export const builder = (argv: Argv) =>
  argv
    .positional('node_uri', {
      description: 'uri of remote node as [node_key]@[host]:[port]',
      type: 'string',
    })
    .example(
      '$0 connect 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b@86.75.30.9:8885',
      'connect by node uri',
    );

export const handler = async (argv: Arguments<any>) => {
  const request = new ConnectRequest();
  request.setNodeUri(argv.node_uri);
  (await loadXudClient(argv)).connect(request, callback(argv));
};
