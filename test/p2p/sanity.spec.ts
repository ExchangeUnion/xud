import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import Logger, { Level } from '../../lib/Logger';
import Config from '../../lib/Config';
import { getUri } from '../../lib/utils/utils';
import uuidv1 from 'uuid/v1';

chai.use(chaiAsPromised);

const createConfig = (instanceId: number, p2pPort: number) => ({
  instanceId,
  initDb: true,
  dbPath: ':memory:',
  logLevel: 'warn',
  logPath: '',
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
    const config = new Config().load();
    nodeOneConfig = createConfig(1, 0);
    nodeTwoConfig = createConfig(2, 0);
    const loggers = Logger.createLoggers(Level.WARN);

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

  it('should place an ownOrder', async () => {
    await expect(nodeOne.service.placeOrder({ pairId: 'BTC/LTC', price: 600, quantity: 0.1, orderId: uuidv1() })).to.be.fulfilled;
  });

  it('should verify that the order gets transmitted between nodes', async () => {
    const nodeTwoOrders = await nodeTwo.service.getOrders({ pairId: 'BTC/LTC', maxResults: 10, includeOwnOrders: false });
    expect(nodeTwoOrders.get('BTC/LTC')!.buy.length).to.equal(1);
  });

  it('should disconnect successfully', async () => {
    await expect(nodeOne.service.disconnect({ nodePubKey: nodeTwo.nodePubKey }))
      .to.be.fulfilled;

    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should drop orders upon peer disconnection', async () => {
    const nodeTwoOrders = await nodeTwo.service.getOrders({ pairId: 'BTC/LTC', maxResults: 10, includeOwnOrders: false });
    expect(nodeTwoOrders.get('BTC/LTC')!.buy).to.be.empty;
  });

  it('should fail when connecting to an unexpected node pub key', async () => {
    const connectPromise = nodeOne.service.connect({ nodeUri: getUri({
      nodePubKey: 'thewrongpubkey',
      host: 'localhost',
      port: nodeTwoPort,
    }) });
    await expect(connectPromise).to.be.rejectedWith(
      `node at localhost:${nodeTwoPort} sent pub key ${nodeTwo.nodePubKey}, expected thewrongpubkey`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult).to.be.empty;
  });

  it('should fail when connecting to self', async () => {
    await expect(nodeOne.service.connect({ nodeUri: nodeOneUri }))
    .to.be.rejectedWith('cannot attempt connection to self');
  });

  it('should fail connecting to a non-existing node', async () => {
    const connectPromise = nodeOne.service.connect({ nodeUri: getUri({ nodePubKey: 'notarealnodepubkey', host: 'localhost', port: 9003 }) });
    await expect(connectPromise).to.be.rejectedWith('could not connect to peer at localhost:9003');
  });

  after(async () => {
    await Promise.all([nodeOne['shutdown'](), nodeTwo['shutdown']()]);
  });
});
