import Table, { HorizontalTable } from 'cli-table3';
import colors from 'colors/safe';
import { Arguments } from 'yargs';
import { ListPeersRequest, ListPeersResponse, Peer } from '../../proto/xudrpc_pb';
import { callback, loadXudClient } from '../command';
import { generateHeaders, shorten } from '../utils';

const HEADERS = ['Peer', 'Pairs', 'Details'];

const createTable = () => {
  const table = new Table({ head: generateHeaders(HEADERS) }) as HorizontalTable;
  return table;
};

const formatPairList = (pairs: string[]) => {
  let pairString = '';
  pairs.forEach((pair) => {
    pairString = `${pairString}${pairString ? '\n' : ''}${pair}`;
  });
  return pairString;
};

const formatLndPubKeys = (lndKeys: string[][]) => {
  let str = '';
  lndKeys.forEach((client) => {
    str = `${str}${str ? '\n' : ''}${client[0]} lnd key: ${shorten(client[1])}`;
  });
  return str;
};

const formatPeers = (peers: ListPeersResponse.AsObject) => {
  const formattedPeers: string[][] = [];
  peers.peersList.forEach((peer: Peer.AsObject) => {
    const address = `${peer.nodePubKey}
@${peer.address}`;

    const details = [
      `Alias: ${peer.alias}

Address ([node_key]@[host]:[port]):
${address}`,
      formatPairList(peer.pairsList),
      `inbound: ${peer.inbound}\
\nversion: ${peer.xudVersion}\
\ntime connected: ${peer.secondsConnected.toString()} seconds\
\n${formatLndPubKeys(peer.lndPubKeysMap)}`,
    ];
    formattedPeers.push(details);
  });
  return formattedPeers;
};

const displayTables = (peers: ListPeersResponse.AsObject) => {
  const table = createTable();
  formatPeers(peers).forEach((peer) => {
    table.push(peer);
  });
  console.log(colors.underline(colors.bold('\nPeers:')));
  console.log(table.toString());
};

export const command = 'listpeers';

export const describe = 'list connected peers';

export const handler = async (argv: Arguments) => {
  (await loadXudClient(argv)).listPeers(new ListPeersRequest(), callback(argv, displayTables));
};
