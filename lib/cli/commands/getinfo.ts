import { Arguments } from 'yargs';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { callback, loadXudClient } from '../command';
import { GetInfoRequest, GetInfoResponse, LndInfo, ConnextInfo } from '../../proto/xudrpc_pb';

const displayLndInfo = (asset: string, info: LndInfo.AsObject) => {
  const basicInfotable = new Table() as VerticalTable;
  basicInfotable.push({ [colors.blue('Status')]: info.status });

  const address = info.urisList[0]
    ? `${info.urisList[0].substring(0, info.urisList[0].indexOf('@'))}
${info.urisList[0].substring(info.urisList[0].indexOf('@'))}`
    : '';

  const pendingChannelText = info.channels && info.channels.pending > 0 ? ` | Pending: ${info.channels.pending}` : '';
  const closedChannelText = info.channels && info.channels.closed > 0 ? ` | Closed: ${info.channels.closed}` : '';
  const inactiveChannelText =
    info.channels && info.channels.inactive > 0 ? ` | Inactive: ${info.channels.inactive}` : '';

  basicInfotable.push(
    { [colors.blue('Version')]: info.version || '' },
    { [colors.blue('Address')]: address },
    { [colors.blue('Alias')]: info.alias || '' },
    {
      [colors.blue('Channels')]: `Active: ${
        info.channels ? info.channels.active : 0
      }${inactiveChannelText}${pendingChannelText}${closedChannelText}`,
    },
    {
      [colors.blue('Network')]:
        info.chainsList && info.chainsList.length > 0
          ? `${info.chainsList[0].chain} ${info.chainsList[0].network}`
          : '',
    },
  );

  console.log(colors.underline(colors.bold(`\nLND-${asset} Info:`)));
  console.log(basicInfotable.toString(), '\n');
};

const determineXudStatus = (numPeers: number, lndMap: [string, LndInfo.AsObject][]) => {
  let status = '';

  if (numPeers === 0) {
    status = 'Not connected to any peers';
    status += '\n';
  }

  lndMap.forEach((asset) => {
    if (asset[1].status !== 'Ready') {
      status += `LND-${asset[0]}: ${asset[1].status}`;
      status += '\n';
    }
  });

  return status.substring(0, status.length - 1) || 'Ready';
};

const displayGeneral = (info: GetInfoResponse.AsObject) => {
  const table = new Table() as VerticalTable;
  const address = info.urisList[0]
    ? `${info.urisList[0].substring(0, info.urisList[0].indexOf('@'))}
${info.urisList[0].substring(info.urisList[0].indexOf('@'))}`
    : '';

  table.push(
    { [colors.blue('Status')]: determineXudStatus(info.numPeers, info.lndMap) },
    { [colors.blue('Alias')]: info.alias },
    { [colors.blue('Node Key')]: info.nodePubKey },
    { [colors.blue('Address')]: address },
    { [colors.blue('Network')]: info.network },
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Peers')]: info.numPeers },
    { [colors.blue('Pairs')]: info.numPairs },
    { [colors.blue('Own orders')]: info.orders ? info.orders.own : '0' },
    { [colors.blue('Peer orders')]: info.orders ? info.orders.peer : '0' },
    {
      [colors.blue('Pending swaps')]: info.pendingSwapHashesList
        ? JSON.stringify(info.pendingSwapHashesList, undefined, 1)
        : '',
    },
  );
  console.log(colors.underline(colors.bold('\nGeneral XUD Info')));
  console.log(table.toString(), '\n');
};

const displayConnext = (info: ConnextInfo.AsObject) => {
  const table = new Table() as VerticalTable;

  table.push(
    { [colors.blue('Status')]: info.status },
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Address')]: info.address },
    { [colors.blue('Network')]: info.chain },
  );

  console.log(colors.underline(colors.bold('\nConnext info:')));
  console.log(table.toString(), '\n');
};

const displayGetInfo = (response: GetInfoResponse.AsObject) => {
  displayGeneral(response);
  if (response.connext) {
    displayConnext(response.connext);
  }

  response.lndMap.forEach((asset) => displayLndInfo(asset[0], asset[1]));
};

export const command = 'getinfo';

export const describe = 'get general info from the local xud node';

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).getInfo(new GetInfoRequest(), callback(argv, displayGetInfo));
};
