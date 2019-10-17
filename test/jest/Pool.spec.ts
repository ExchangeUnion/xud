import Pool from '../../lib/p2p/Pool';
import Logger, { Level } from '../../lib/Logger';
import Config from '../../lib/Config';
import DB from '../../lib/db/DB';
import { XuNetwork } from '../../lib/constants/enums';
import NodeKey from '../../lib/nodekey/NodeKey';
import errors from '../../lib/p2p/errors';
import Peer from '../../lib/p2p/Peer';
import { Address } from '../../lib/p2p/types';
import Network from '../../lib/p2p/Network';
import uuid = require('uuid');

describe('P2P Pool', () => {
  let pool1db: DB;
  let pool2db: DB;
  let pool: Pool;
  let pool2: Pool;
  let remotePeer: Peer;
  let pool1nodeKey: NodeKey;
  let pool2nodeKey: NodeKey;
  const logger = Logger.createLoggers(Level.Warn).p2p;
  let poolPort: number;
  let pool2Port: number;

  beforeEach(async () => {
    pool1nodeKey = await NodeKey['generate']();
    pool2nodeKey = await NodeKey['generate']();

    const config = new Config();
    config.p2p.listen = true;
    config.p2p.discover = false;
    pool1db = new DB(logger);
    await pool1db.init(XuNetwork.RegTest);
    pool2db = new DB(logger);
    await pool2db.init(XuNetwork.RegTest);

    pool = new Pool({
      logger,
      config: {
        ...config.p2p,
        port: 0,
      },
      xuNetwork: XuNetwork.RegTest,
      models: pool1db.models,
      nodeKey: pool1nodeKey,
      version: '1.0.0',
    });

    await pool.init();
    poolPort = pool['listenPort']!;

    pool2 = new Pool({
      logger,
      config: {
        ...config.p2p,
        port: 0,
      },
      xuNetwork: XuNetwork.RegTest,
      models: pool2db.models,
      nodeKey: pool2nodeKey,
      version: '1.0.0',
    });

    await pool2.init();
    pool2Port = pool2['listenPort']!;

    const address: Address = { host: 'localhost', port: poolPort };
    remotePeer = new Peer(logger, address, new Network(XuNetwork.RegTest));
  });

  afterEach(async () => {
    await remotePeer.close();
    await pool.disconnect();
    await pool2.disconnect();
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

  test('should reject connecting to its own addresses', async () => {
    const selfAddresses = [
      '::1',
      '0.0.0.0',
      '127.0.0.1',
      'localhost',
    ];

    for (const address of selfAddresses) {
      await expect(pool.addOutbound({
        host: address,
        port: poolPort,
      }, '', false, false)).rejects.toEqual(errors.ATTEMPTED_CONNECTION_TO_SELF);
    }
  });

  test('it rejects inbound peer because of pubKey mismatch (AuthFailureInvalidTarget)', async () => {
    const ownNodeState = {
      addresses: [{ host: '1.1.1.1', port: poolPort }, { host: '2.2.2.2', port: poolPort }],
      pairs: [uuid()],
      raidenAddress: uuid(),
      lndPubKeys: { BTC: uuid(), LTC: uuid() },
      lndUris: { BTC: [''], LTC: [''] },
      tokenIdentifiers: { BTC: 'bitcoin-testnet', LTC: 'litecoin-testnet' },
    };
    const ownNodeKey = await NodeKey['generate']();
    const expectedNodePubKey = (await NodeKey['generate']()).pubKey;
    try {
      await remotePeer.beginOpen({
        ownNodeState,
        ownNodeKey,
        expectedNodePubKey,
        ownVersion: '1.0.0-mainnet',
      });
    } catch (e) {
      expect(e.message).toEqual(
        expect.stringContaining('AuthFailureInvalidTarget'),
      );
    }
  });

  test('it accepts inbound peer', async () => {
    const ownNodeState = {
      addresses: [{ host: '1.1.1.1', port: poolPort }, { host: '2.2.2.2', port: poolPort }],
      pairs: [uuid()],
      raidenAddress: uuid(),
      lndPubKeys: { BTC: uuid(), LTC: uuid() },
      lndUris: { BTC: [''], LTC: [''] },
      tokenIdentifiers: { BTC: 'bitcoin-testnet', LTC: 'litecoin-testnet' },
    };
    const ownNodeKey = await NodeKey['generate']();
    const expectedNodePubKey = pool1nodeKey.pubKey;
    const sessionInitPacket = await remotePeer.beginOpen({
      ownNodeState,
      ownNodeKey,
      expectedNodePubKey,
      ownVersion: '1.0.0-mainnet',
    });
    expect(sessionInitPacket).toBeTruthy();
  });

  test('it rejects when already connected', async () => {
    const pool1address: Address = { host: 'localhost', port: poolPort };
    const pool2address: Address = { host: 'localhost', port: pool2Port };
    const poolPromises: Promise<any>[] = [];
    expect(pool['peers'].size).toEqual(0);
    expect(pool2['peers'].size).toEqual(0);
    pool2['handleSocket'] = jest.fn(async (socket) => {
      const waitFor = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };
      await waitFor(100);
      await pool2['addInbound'](socket);
    });
    poolPromises.push(
      pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false),
    );
    poolPromises.push(
      pool2.addOutbound(pool1address, pool1nodeKey.pubKey, true, false),
    );
    try {
      await Promise.all(poolPromises);
    } catch (e) {
      expect(e.message).toEqual(
        expect.stringContaining('AlreadyConnected'),
      );
    }
    expect(pool['peers'].size).toEqual(1);
    expect(pool2['peers'].size).toEqual(1);
  });

  test('it rejects multiple outbound connections to same peer', async () => {
    const pool2address: Address = { host: 'localhost', port: pool2Port };
    expect(pool['peers'].size).toEqual(0);
    expect(pool2['peers'].size).toEqual(0);
    const firstOutboundAttempt = pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);
    const secondOutboundAttempt = pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);
    try {
      await secondOutboundAttempt;
    } catch (e) {
      expect(e.message).toEqual(
        expect.stringContaining('existing connection attempt'),
      );
    }
    await firstOutboundAttempt;
    expect(pool['pendingOutboundPeers'].size).toEqual(0);
    expect(pool['peers'].size).toEqual(1);
    expect(pool2['peers'].size).toEqual(1);
  });

});
