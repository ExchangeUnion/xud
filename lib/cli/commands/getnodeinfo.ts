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

export const command = 'getnodeinfo <node_pub_key>';

export const describe = 'get general information about a node';

export const builder = {
  node_pub_key: {
    type: 'string',
    description: 'nodePubKey of node to get reputation',
  },
};

export const handler = (argv: Arguments) => {
  const request = new GetNodeInfoRequest();
  request.setNodePubKey(argv.node_pub_key);
  loadXudClient(argv).getNodeInfo(request, callback(argv, displayNodeInfo));
};
