import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

const createConfig = (instanceId: number, p2pPort: number) => ({
  instanceId,
  p2p: {
    listen: true,
    port: p2pPort,
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
  db: {
    database: 'xud_test',
  },
});

describe('P2P Sanity Tests', () => {
  let nodeOneConfig: any;
  let nodeOne: Xud;
  let nodeTwoConfig: any;
  let nodeTwo: Xud;

  before(async () => {
    nodeOneConfig = createConfig(1, 9001);
    nodeOne = new Xud(nodeOneConfig);

    nodeTwoConfig = createConfig(2, 9002);
    nodeTwo = new Xud(nodeTwoConfig);

    await Promise.all([nodeTwo.start(), nodeOne.start()]);
  });

  it('should connect successfully', async () => {
    const result = await nodeOne.service.connect({ host: 'localhost', port: nodeTwoConfig.p2p.port, nodePubKey: nodeTwo.nodePubKey });
    expect(result).to.be.equal(`Connected to peer ${nodeTwo.nodePubKey}`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(1);
  });

  it('should fail connecting to the same node', async () => {
    expect(nodeOne.service.connect({ host: 'localhost', port: nodeTwoConfig.p2p.port, nodePubKey: nodeTwo.nodePubKey }))
    .to.be.rejectedWith('already connected');
  });

  it('should disconnect successfully', async () => {
    const result = await nodeOne.service.disconnect({ nodePubKey: nodeTwo.nodePubKey });
    expect(result).to.be.equal(`success`);
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(0);
  });

  it('should fail when connecting to an unexpected node pub key', async () => {
    const result = await nodeOne.service.connect({ host: 'localhost', port: nodeTwoConfig.p2p.port, nodePubKey: 'thewrongpubkey' });
    expect(result).to.be.equal('Not connected');
    const listPeersResult = await nodeOne.service.listPeers();
    expect(listPeersResult.length).to.equal(0);
  });

  it('should fail when connecting to self', async () => {
    expect(nodeOne.service.connect({ host: 'localhost', port: nodeOneConfig.p2p.port, nodePubKey: nodeOne.nodePubKey }))
    .to.be.rejectedWith('Cannot attempt connection to self');
  });

  it('should fail connecting to a non-existing node', async () => {
    const result = await nodeOne.service.connect({ host:'localhost', port: 9003, nodePubKey: 'notarealnodepubkey' });
    expect(result).to.be.equal('Not connected');
  });

  after(async () => {
    await Promise.all([nodeOne.shutdown(), nodeTwo.shutdown()]);
  });
});
