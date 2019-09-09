import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { GetInfoRequest, GetInfoResponse, LndInfo, RaidenInfo } from '../../proto/xudrpc_pb';
import { SwapClientStatus } from '../../constants/enums';

type generalInfo = {
  alias: string;
  address: string;
  network: string;
  version: string;
  numPeers: number;
  numPairs: number;
  nodePubKey: string;
  orders: {own: number, peer: number} | undefined
};

const displayLndInfo = (asset: string, info: LndInfo.AsObject) => {
  const basicInfotable = new Table() as VerticalTable;
  basicInfotable.push(
    { [colors.blue('Status')]: SwapClientStatus[info.status] },
  );
  if (info.error) {
    basicInfotable.push(
        { [colors.blue('Error')]: info.error },
    );
  }

  const address = info.urisList[0] ? `${info.urisList[0].substring(0, info.urisList[0].indexOf('@'))}
${info.urisList[0].substring(info.urisList[0].indexOf('@'))}` : '';

  basicInfotable.push(
    { [colors.blue('Version')]: info.version || ''   },
    { [colors.blue('Address')]: address },
    { [colors.blue('Alias')] : info.alias || '' },
    { [colors.blue('Channels')] :
 `Active: ${info.channels ? info.channels['active'] : 0}\
 | Pending: ${info.channels ? info.channels['pending'] : 0}\
 | Closed: ${info.channels ? info.channels['closed'] : 0}`,
    },
    { [colors.blue('Chain')] : info.chainsList ? `${info.chainsList[0].chain} ${info.chainsList[0].network}` : '' },
  );

  console.log(colors.underline(colors.bold(`\nLND-${asset} Info:`)));
  console.log(basicInfotable.toString(), '\n');
};

const displayGeneral = (info: generalInfo) => {
  const table = new Table() as VerticalTable;
  table.push(
    { [colors.blue('Alias')]: info.alias },
    { [colors.blue('Public Key')]: info.nodePubKey },
    { [colors.blue('Address')]: info.address },
    { [colors.blue('Network')]: info.network },
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Peers')]: info.numPeers },
    { [colors.blue('Pairs')]: info.numPairs },
    { [colors.blue('Own orders')]: info.orders ? info.orders.own : '0' },
    { [colors.blue('Peer orders')]: info.orders ? info.orders.peer : '0' },
  );
  console.log(colors.underline(colors.bold('\nXUD Info')));
  console.log(table.toString(), '\n');
};

const displayRaiden = (info: RaidenInfo.AsObject) => {
  const table = new Table() as VerticalTable;

  table.push({ [colors.blue('Status')]: SwapClientStatus[info.status] });
  if (info.error) {
    table.push({ [colors.blue('Error')]: info.error });
  }
  table.push(
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Address')]: info.address },
    { [colors.blue('Channels')] :
 `Active: ${info.channels ? info.channels['active'] : 0}\
 | Pending: 0\
 | Closed: ${info.channels ? info.channels['closed'] : 0}`,
    },
    { [colors.blue('Chain')] : info.chain  },
  );

  console.log(colors.underline(colors.bold('\nRaiden info:')));
  console.log(table.toString(), '\n');

};

const displayGetInfo = (response: GetInfoResponse.AsObject) => {
  displayGeneral({
    alias: response.alias,
    address: response.urisList[0],
    network: response.network,
    nodePubKey: response.nodePubKey,
    numPairs: response.numPairs,
    numPeers: response.numPeers,
    version: response.version,
    orders: response.orders,
  });
  if (response.raiden) {
    displayRaiden(response.raiden);
  }

  response.lndMap.forEach(asset => displayLndInfo(asset[0], asset[1]));
};

export const command = 'getinfo';

export const describe = 'get general info from the xud node';

export const handler = (argv: Arguments) => {
  loadXudClient(argv).getInfo(new GetInfoRequest(), callback(argv, displayGetInfo));
};
