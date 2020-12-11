import { Arguments, Argv } from 'yargs';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { callback, loadXudClient } from '../command';
import { GetNodeInfoRequest, GetNodeInfoResponse } from '../../proto/xudrpc_pb';

const displayNodeInfo = (node: GetNodeInfoResponse.AsObject) => {
  const table = new Table() as VerticalTable;
  const bannedTitle = colors.blue('Banned');
  const reputationScore = colors.blue('Reputation Score');
  table.push({ [bannedTitle]: node.banned }, { [reputationScore]: node.reputationscore });
  console.log(colors.underline(colors.bold('\nNode info:')));
  console.log(table.toString());
};

export const command = 'getnodeinfo <node_identifier>';

export const describe = 'get general information about a known node';

export const builder = (argv: Argv) =>
  argv
    .positional('node_identifier', {
      type: 'string',
      description: 'the node key or alias of the node to get information for',
    })
    .example(
      '$0 getnodeinfo 028599d05b18c0c3f8028915a17d603416f7276c822b6b2d20e71a3502bd0f9e0b',
      'get info about a node by node key',
    )
    .example('$0 getnodeinfo CheeseMonkey', 'get info about a node by alias');

export const handler = async (argv: Arguments<any>) => {
  const request = new GetNodeInfoRequest();
  request.setNodeIdentifier(argv.node_identifier);
  (await loadXudClient(argv)).getNodeInfo(request, callback(argv, displayNodeInfo));
};
