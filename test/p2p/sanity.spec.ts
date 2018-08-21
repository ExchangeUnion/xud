import chai, { expect } from 'chai';
import Xud from '../../lib/Xud';
import chaiAsPromised from 'chai-as-promised';
import DB from '../../lib/db/DB';
import Logger from '../../lib/Logger';
import Config from '../../lib/Config';

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
    database: instanceId === 1 ? 'xud_test' : `xud_test${instanceId}`,
  },
});

describe('P2P Sanity Tests', () => {
  let nodeOneConfig: any;
  let nodeOne: Xud;
  let nodeTwoConfig: any;
  let nodeTwo: Xud;

  before(async () => {
    nodeOneConfig = createConfig(1, 9001);
    nodeTwoConfig = createConfig(2, 9002);
    const loggers = Logger.createLoggers();

    // make sure the nodes table is empty
    const dbConfig = new Config().testDb;
    const dbOne = new DB(dbConfig, loggers.db);
    const dbTwo = new DB({ ...dbConfig, database: 'xud_test2' }, loggers.db);
    await Promise.all([dbOne.init(), dbTwo.init()]);
    await Promise.all([dbOne.models.Node.truncate(), dbTwo.models.Node.truncate()]);
    await Promise.all([dbOne.close(), dbTwo.close()]);

    nodeOne = new Xud();
    nodeTwo = new Xud();

    await Promise.all([nodeOne.start(nodeOneConfig), nodeTwo.start(nodeTwoConfig)]);
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
    const result = await nodeOne.service.connect({ host: 'localhost', port: 9003, nodePubKey: 'notarealnodepubkey' });
    expect(result).to.be.equal('Not connected');
  });

  after(async () => {
    await Promise.all([nodeOne['db'].models.Node.truncate(), nodeTwo['db'].models.Node.truncate()]);
    await Promise.all([nodeOne['shutdown'](), nodeTwo['shutdown']()]);
  });
});
