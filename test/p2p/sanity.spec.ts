import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import { toUri } from '../../lib/utils/uriUtils';
import { getUnusedPort, getTempDir } from '../utils';
import { DisconnectionReason, XuNetwork } from '../../lib/constants/enums';
import NodeKey from '../../lib/nodekey/NodeKey';

chai.use(chaiAsPromised);

export const createConfig = (instanceid: number, p2pPort: number, uniqueXudir = true, network = XuNetwork.SimNet) => ({
  instanceid,
  network,
  initdb: false,
  xudir: getTempDir(uniqueXudir),
  dbpath: ':memory:',
  loglevel: 'error',
  logpath: '',
  p2p: {
    listen: true,
    port: p2pPort,
    addresses: [`localhost:${p2pPort}`],
  },
  rpc: {
    disable: true,
  },
  lnd: {
    LTC: {
      disable: true,
      nomacaroons: true,
    },
    BTC: {
      disable: true,
      nomacaroons: true,
    },
  },
  raiden: {
    disable: true,
  },
});

describe('P2P Sanity Tests', () => {
  let nodeOneConfig: any;
  let nodeOne: Xud;
  let nodeOneUri: string;
  let nodeTwoConfig: any;
  let nodeTwo: Xud;
  let nodeTwoUri: string;
  let nodeTwoPort: number;
  let unusedPort: number;

  before(async () => {
    nodeOneConfig = createConfig(1, 0);
    nodeTwoConfig = createConfig(2, 0);

    nodeOne = new Xud();
    nodeTwo = new Xud();

    await Promise.all([nodeOne.start(nodeOneConfig), nodeTwo.start(nodeTwoConfig)]);

    nodeTwoPort = nodeTwo['pool']['listenPort']!;
    nodeOneUri = toUri({ nodePubKey: nodeOne.nodePubKey, host: 'localhost', port: nodeOne['pool']['listenPort']! });
    nodeTwoUri = toUri({ nodePubKey: nodeTwo.nodePubKey, host: 'localhost', port: nodeTwoPort });

    unusedPort = await getUnusedPort();
  });

  it('should connect successfully', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri, retryConnecting: false }))
      .to.be.fulfilled;

    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(1);
    expect(listPeersResult[0].nodePubKey).to.equal(nodeTwo.nodePubKey);
  });

  it('should update the node state', (done) => {
    const raidenAddress = '0xbb9bc244d798123fde783fcc1c72d3bb8c189413';
    const nodeTwoPeer = nodeOne['pool'].getPeer(nodeTwo.nodePubKey);
    nodeTwoPeer.on('nodeStateUpdate', () => {
      expect(nodeTwoPeer['nodeState']!.raidenAddress).to.equal(raidenAddress);
      done();
    });

    nodeTwo['pool'].updateRaidenAddress(raidenAddress);
  });

  it('should fail connecting to the same node', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri, retryConnecting: false }))
      .to.be.rejectedWith('already connected');
  });

  it('should disconnect successfully', async () => {
    await nodeOne['pool']['closePeer'](nodeTwo.nodePubKey, DisconnectionReason.NotAcceptingConnections);

    const listPeersResult = nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to an unexpected node pub key', async () => {
    const randomPubKey =  (await NodeKey['generate']()).nodePubKey;
    const host = 'localhost';
    const port = nodeTwoPort;
    const nodeUri = toUri({ host, port, nodePubKey: randomPubKey });

    const connectPromise = nodeOne.service.connect({ nodeUri, retryConnecting: false });
    await expect(connectPromise).to.be.rejectedWith(`Peer (${host}:${port}) disconnected from us due to AuthFailureInvalidTarget`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to an invalid node pub key', async () => {
    const invalidPubKey =  '0123456789';
    const host = 'localhost';
    const port = nodeTwoPort;
    const nodeUri = toUri({ host, port, nodePubKey: invalidPubKey });

    const connectPromise = nodeOne.service.connect({ nodeUri, retryConnecting: false });
    await expect(connectPromise).to.be.rejectedWith(`Peer (${host}:${port}) disconnected from us due to AuthFailureInvalidTarget`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to self', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeOneUri, retryConnecting: false }))
    .to.be.rejectedWith('cannot attempt connection to self');
  });

  it('should fail connecting to a non-existing node', async () => {
    const host = 'localhost';
    const port = unusedPort;
    const nodeUri = toUri({ host, port, nodePubKey: 'notarealnodepubkey' });

    const connectPromise = nodeOne.service.connect({ nodeUri, retryConnecting: false });
    await expect(connectPromise).to.be.rejectedWith(`could not connect to peer at localhost:${port}`);
  });

  it('should revoke connection retries when connecting to the same nodePubKey', (done) => {
    const nodePubKey = 'notarealnodepubkey';
    const host = 'localhost';
    const port = unusedPort;
    const nodeUri =  toUri({ host, port, nodePubKey });
    const connectPromise = nodeOne.service.connect({ nodeUri, retryConnecting: true });

    setImmediate(() => {
      expect(nodeOne.service.connect({ nodeUri, retryConnecting: false }))
        .to.be.rejectedWith(`could not connect to peer at localhost:${unusedPort}`);
      done();
    });

    expect(connectPromise).to.be.rejectedWith('Connection retry attempts to peer were revoked');
  });

  it('should fail when connecting to a node that has banned us', async () => {
    await nodeTwo.service.ban({ nodePubKey: nodeOne.nodePubKey });
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri, retryConnecting: false }))
      .to.be.rejectedWith(`Peer (localhost:${nodeTwoPort}) disconnected from us due to Banned`);
  });

  after(async () => {
    await Promise.all([nodeOne['shutdown'](), nodeTwo['shutdown']()]);
  });
});
