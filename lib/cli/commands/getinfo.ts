import { callback, loadXudClient } from '../command';
import { Arguments } from 'yargs';
import Table, { VerticalTable } from 'cli-table3';
import colors from 'colors/safe';
import { GetInfoRequest, GetInfoResponse, LndInfo, RaidenInfo } from '../../proto/xudrpc_pb';

const displayChannels = (channels: any, asset: string) => {
  const table = new Table() as VerticalTable;
  Object.keys(channels).forEach((key: any) => {
    table.push({
      [colors.blue(key)] : channels[key],
    });
  });
  console.log(colors.underline(colors.bold(`\nLnd ${asset} channels:`)));
  console.log(table.toString(), '\n');
};

const displayChainsList = (list: any[], asset: string) => {
  const table = new Table() as VerticalTable;
  list.forEach((asset, i) => {
    if (asset) {
      table.push({ [colors.blue(`${i + 1}.`)]: `${asset.chain}-${asset.network}` });
    }
  });
  if (table.length !== 0) {
    console.log(colors.underline(colors.bold(`\nLnd ${asset} chains:`)));
    console.log(table.toString(), '\n');
  }
};

const displayUriList = (uris: string[], asset: string) => {
  const table = new Table() as VerticalTable;
  uris.forEach((uri, i) => table.push({ [`${i + 1}.`]: uri }));
  console.log(colors.underline(colors.bold(`\nLnd ${asset} uris:`)));
  console.log(table.toString(), '\n');
};

const displayLndInfo = (asset: string, info: LndInfo.AsObject) => {
  const basicInfotable = new Table() as VerticalTable;
  basicInfotable.push(
    { [colors.blue('Error')]: info.error },
  );
  if (info.blockheight) {
    basicInfotable.push({ [colors.blue('Block Height')]: info.blockheight });
  }
  if (info.version) {
    basicInfotable.push({ [colors.blue('Version')]: info.version });
  }
  if (info.alias) {
    basicInfotable.push({ [colors.blue('Alias')] : info.alias });
  }

  console.log(colors.underline(colors.bold(`\nLnd ${asset} info:`)));
  console.log(basicInfotable.toString(), '\n');

  if (info.channels) {
    displayChannels(info.channels, asset);
  }

  if (!info.error) {
    displayChainsList(info.chainsList, asset);
  }

  if (info.urisList.length > 0) {
    displayUriList(info.urisList, asset);
  }
};

const displayGeneral = (info: GetInfoResponse.AsObject) => {
  const table = new Table() as VerticalTable;
  table.push(
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Pairs')]: info.numPairs },
    { [colors.blue('Peers')]: info.numPeers },
    { [colors.blue('Node key')]: info.nodePubKey },
  );
  if (info.orders) {
    table.push(
      { [colors.blue('Own orders')]: info.orders.own },
      { [colors.blue('Peer orders')]: info.orders.peer },
    );
  }
  if (info.pendingSwapHashesList) {
    table.push(
      { [colors.blue('Pending swaps')]: JSON.stringify(info.pendingSwapHashesList) },
    );
  }
  console.log(colors.underline(colors.bold('\nGeneral XUD Info')));
  console.log(table.toString(), '\n');
};

const displayRaiden = (info: RaidenInfo.AsObject) => {
  const table = new Table() as VerticalTable;
  table.push(
    { [colors.blue('Version')]: info.version },
    { [colors.blue('Address')]: info.address },
    { [colors.blue('Channels')]: info.channels },
    { [colors.blue('Error')]: info.error },
  );
  console.log(colors.underline(colors.bold('\nRaiden info:')));
  console.log(table.toString(), '\n');
};

const displayGetInfo = (response: GetInfoResponse.AsObject) => {
  displayGeneral(response);
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
