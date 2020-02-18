import { XuNetwork } from '../../lib/constants/enums';
import Logger, { Level } from '../../lib/Logger';
import Network from '../../lib/p2p/Network';
import Peer from '../../lib/p2p/Peer';
import { Address } from '../../lib/p2p/types';
import addressUtils from '../../lib/utils/addressUtils';
import { getAlias } from '../../lib/utils/uriUtils';

describe('Peer', () => {
  const logger = Logger.createLoggers(Level.Warn).p2p;
  const address: Address = { host: '86.75.30.9', port: 1337 };
  const addressStr = addressUtils.toString(address);
  const nodePubKey = '038395febbcecdcb869b95b5fe73419ef2602f640c6bfc88635d99a111015c0822';
  let peer: Peer;

  beforeAll(async () => {
    peer = new Peer(logger, address, new Network(XuNetwork.RegTest));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('peer label equals address when node pub key unknown', async () => {
    expect(peer.label).toEqual(addressStr);
  });

  test('peer label equals expected node pub key with address when key is unestablished', async () => {
    peer['expectedNodePubKey'] = nodePubKey;
    expect(peer.label).toEqual(`${nodePubKey}@${addressStr}`);
  });

  test('peer label equals established node pub key + alias', async () => {
    const nodePubKey = '038395febbcecdcb869b95b5fe73419ef2602f640c6bfc88635d99a111015c0822';
    peer['_nodePubKey'] = nodePubKey;
    const alias = getAlias(nodePubKey);
    const expectedLabel = `${nodePubKey} (${alias})`;
    expect(peer.label).toEqual(expectedLabel);
  });
});
