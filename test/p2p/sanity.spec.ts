import { expect } from 'chai';
import Xud from '../../lib/Xud';
import { errorCodes } from '../../lib/p2p/errors';

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
    await nodeOne.start();

    nodeTwoConfig = createConfig(2, 9001);
    nodeTwo = new Xud(nodeTwoConfig);
    await nodeTwo.start();
  });

  it('should connect successfully', async () => {
    const result = await nodeOne.service.connect({ host: 'localhost', port: nodeTwoConfig.p2p.port });
    expect(result).to.be.equal(`Connected to peer (localhost:${nodeTwoConfig.p2p.port})`);
  });

  it('should fail connecting to the same address', async () => {
    try {
      await nodeOne.service.connect({ host: 'localhost', port: nodeTwoConfig.p2p.port });
    } catch (err) {
      expect(err.code).to.be.equal(errorCodes.ADDRESS_ALREADY_CONNECTED);
    }
  });

  it('should fail connecting to a non-existing nodenode', async () => {
    const result = await nodeOne.service.connect({ host:'localhost', port: 9002 });
    expect(result).to.be.equal('Not connected');
  });

  after(async () => {
    await nodeOne.shutdown();
    await nodeTwo.shutdown();
  });
});
