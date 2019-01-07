import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import { getUri } from '../../lib/utils/utils';
import { getUnusedPort } from '../utils';
import { DisconnectionReason, ReputationEvent } from '../../lib/types/enums';
import NodeKey from '../../lib/nodekey/NodeKey';

chai.use(chaiAsPromised);

const createConfig = (instanceid: number, p2pPort: number) => ({
  instanceid,
  initdb: false,
  dbpath: ':memory:',
  loglevel: 'warn',
  logpath: '',
  p2p: {
    listen: true,
    port: p2pPort,
    addresses: [`localhost:${p2pPort}`],
  },
  rpc: {
    disable: true,
  },
  lndbtc: {
    disable: true,
  },
  lndltc: {
    disable: true,
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

  before(async () => {
    nodeOneConfig = createConfig(1, 0);
    nodeTwoConfig = createConfig(2, 0);

    nodeOne = new Xud();
    nodeTwo = new Xud();

    await Promise.all([nodeOne.start(nodeOneConfig), nodeTwo.start(nodeTwoConfig)]);

    nodeTwoPort = nodeTwo['pool']['listenPort']!;
    nodeOneUri = getUri({ nodePubKey: nodeOne.nodePubKey, host: 'localhost', port: nodeOne['pool']['listenPort']! });
    nodeTwoUri = getUri({ nodePubKey: nodeTwo.nodePubKey, host: 'localhost', port: nodeTwoPort });
  });

  it('should connect successfully', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri }))
      .to.be.fulfilled;

    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(1);
    expect(listPeersResult[0].nodePubKey).to.equal(nodeTwo.nodePubKey);
  });

  it('should fail connecting to the same node', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeTwoUri }))
      .to.be.rejectedWith('already connected');
  });

  it('should disconnect successfully', () => {
    nodeOne['pool']['closePeer'](nodeTwo.nodePubKey, DisconnectionReason.NotAcceptingConnections);

    const listPeersResult = nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to an unexpected node pub key', async () => {
    const randomPubKey =  (await NodeKey['generate']()).nodePubKey;
    const connectPromise = nodeOne.service.connect({
      nodeUri: getUri({
        nodePubKey: randomPubKey,
        host: 'localhost',
        port: nodeTwoPort,
      }),
    });
    await expect(connectPromise).to.be.rejectedWith(
      `node at localhost:${nodeTwoPort} sent pub key ${nodeTwo.nodePubKey}, expected ${randomPubKey}`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to an invalid node pub key', async () => {
    const invalidPubKey =  '0123456789';
    const connectPromise = nodeOne.service.connect({
      nodeUri: getUri({
        nodePubKey: invalidPubKey,
        host: 'localhost',
        port: nodeTwoPort,
      }),
    });
    await expect(connectPromise).to.be.rejectedWith('Public key is not valid for specified curve');
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to self', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeOneUri }))
    .to.be.rejectedWith('cannot attempt connection to self');
  });

  it('should fail connecting to a non-existing node', async () => {
    const port = await getUnusedPort();
    const connectPromise = nodeOne.service.connect({ nodeUri: getUri({ port, nodePubKey: 'notarealnodepubkey', host: 'localhost' }) });
    await expect(connectPromise).to.be.rejectedWith(`could not connect to peer at localhost:${port}`);
  });

  it('should disconnect from a node after banning it', async () => {
    await nodeOne.service.connect({ nodeUri: nodeTwoUri });

    const nodeList = nodeOne['pool']['nodes'];

    const banned = await nodeList.addReputationEvent(nodeTwo.nodePubKey, ReputationEvent.ManualBan);
    expect(banned).to.be.true;

    expect(nodeList.isBanned(nodeTwo.nodePubKey)).to.be.true;

    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.be.equal(0);
  });

  after(async () => {
    await Promise.all([nodeOne['shutdown'](), nodeTwo['shutdown']()]);
  });
});
