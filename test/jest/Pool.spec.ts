import Pool from '../../lib/p2p/Pool';
import Logger, { Level } from '../../lib/Logger';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { XuNetwork } from '../../lib/constants/enums';
import NodeKey from '../../lib/nodekey/NodeKey';

jest.mock('../../lib/db/DB', () => {
  return jest.fn().mockImplementation(() => {
    return {
      models: {
        Node: {
          findAll: jest.fn(() => []),
        },
      },
    };
  });
});

describe('P2P Pool', () => {
  let db: DB;
  let pool: Pool;
  const logger = Logger.createLoggers(Level.Warn).p2p;

  beforeAll(async () => {
    const nodeKeyTwo = await NodeKey['generate']();

    const config = new Config();
    config.p2p.listen = false;
    config.p2p.discover = false;
    db = new DB(logger);

    pool = new Pool({
      logger,
      config: config.p2p,
      xuNetwork: XuNetwork.SimNet,
      models: db.models,
      nodeKey: nodeKeyTwo,
      version: '1.0.0',
    });

    await pool.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('updateLndState sets lnd pub key and token identifier', async () => {
    const lndPubKey = 'lndPubKey';
    const chain = 'bitcoin-regtest';
    pool.updateLndState({ chain, pubKey: lndPubKey, currency: 'BTC' });
    expect(pool.getTokenIdentifier('BTC')).toEqual(chain);
    expect(pool['nodeState'].lndPubKeys['BTC']).toEqual(lndPubKey);
  });

  test('updateRaidenState sets Raiden address and token identifiers', async () => {
    const tokenAddresses = new Map();
    const raidenAddress = 'raidenAddress';
    const wethTokenAddress = 'wethtokenaddress';
    const daiTokenAddress = 'daitokenaddress';
    tokenAddresses.set('WETH', wethTokenAddress);
    tokenAddresses.set('DAI', daiTokenAddress);
    pool.updateRaidenState(tokenAddresses, raidenAddress);
    expect(pool.getTokenIdentifier('WETH')).toEqual(wethTokenAddress);
    expect(pool.getTokenIdentifier('DAI')).toEqual(daiTokenAddress);
    expect(pool['nodeState'].raidenAddress).toEqual(raidenAddress);
  });
});
