import { Arguments } from 'yargs';
import { callback, loadXudClient } from '../command';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { GetNodeInfoRequest, GetNodeInfoResponse } from '../../proto/xudrpc_pb';

const displayNodeInfo = (node: GetNodeInfoResponse.AsObject) => {
  const table = new Table() as VerticalTable;
  const bannedTitle = colors.blue('Banned');
  const reputationScore = colors.blue('Reputation Score');
  table.push(
    { [bannedTitle]: node.banned }
  , { [reputationScore]: node.reputationscore });
  console.log(colors.underline(colors.bold('\nNode info:')));
  console.log(table.toString());
};

export const command = 'getnodeinfo <node_identifier>';

export const describe = 'get general information about a peer';

export const builder = {
  node_identifier: {
    type: 'string',
    description: 'the node key or alias of the connected peer to get general information from',
  },
};

export const handler = (argv: Arguments<any>) => {
  const request = new GetNodeInfoRequest();
  request.setNodeIdentifier(argv.node_identifier);
  loadXudClient(argv).getNodeInfo(request, callback(argv, displayNodeInfo));
};
