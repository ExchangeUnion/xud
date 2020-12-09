import { setTimeout } from 'timers';
import Config from '../../lib/Config';
import { XuNetwork } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import Logger, { Level } from '../../lib/Logger';
import NodeKey from '../../lib/nodekey/NodeKey';
import errors, { errorCodes } from '../../lib/p2p/errors';
import Network from '../../lib/p2p/Network';
import Peer from '../../lib/p2p/Peer';
import Pool from '../../lib/p2p/Pool';
import { Address } from '../../lib/p2p/types';
import uuid = require('uuid');

describe('P2P Pool', () => {
  let pool1db: DB;
  let pool2db: DB;
  let pool: Pool;
  let pool2: Pool;
  let remotePeer: Peer;
  let pool1nodeKey: NodeKey;
  let pool2nodeKey: NodeKey;
  let pool1address: Address;
  let pool2address: Address;
  const logger1 = Logger.createLoggers(Level.Error, undefined, 1).p2p;
  const logger2 = Logger.createLoggers(Level.Error, undefined, 2).p2p;
  const logger3 = Logger.createLoggers(Level.Error, undefined, 3).p2p;
  let poolPort: number;
  let pool2Port: number;
  const version = '1.0.0';

  const awaitInboundPeer = (pool: Pool) => {
    return new Promise<void>((resolve, reject) => {
      if (pool['pendingInboundPeers'].size) {
        pool.on('peer.active', () => {
          clearTimeout(timeout);
          resolve();
        });
        const timeout = setTimeout(() => reject('timed out waiting for inbound peer'), 500);
      } else {
        resolve();
      }
    });
  };

  beforeEach(async () => {
    pool1nodeKey = await NodeKey['generate']();
    pool2nodeKey = await NodeKey['generate']();

    const config = new Config();
    config.p2p.listen = true;
    config.p2p.discover = false;
    pool1db = new DB(logger1);
    await pool1db.init(XuNetwork.RegTest);
    pool2db = new DB(logger2);
    await pool2db.init(XuNetwork.RegTest);

    pool = new Pool({
      version,
      logger: logger1,
      config: {
        ...config.p2p,
        port: 0,
      },
      xuNetwork: XuNetwork.RegTest,
      models: pool1db.models,
      nodeKey: pool1nodeKey,
    });

    await pool.init();
    poolPort = pool['listenPort']!;

    pool2 = new Pool({
      version,
      logger: logger2,
      config: {
        ...config.p2p,
        port: 0,
      },
      xuNetwork: XuNetwork.RegTest,
      models: pool2db.models,
      nodeKey: pool2nodeKey,
    });

    await pool2.init();
    pool2Port = pool2['listenPort']!;

    pool1address = { host: 'localhost', port: poolPort };
    pool2address = { host: 'localhost', port: pool2Port };

    const address: Address = { host: 'localhost', port: poolPort };
    remotePeer = new Peer(logger3, address, new Network(XuNetwork.RegTest));
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

  test('should open a connection with a new peer and add to node list', async () => {
    const createNodeSpy = jest.spyOn(pool['nodes'], 'createNode');
    await pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);

    expect(createNodeSpy).toHaveBeenCalledWith({
      addresses: pool2.addresses,
      nodePubKey: pool2nodeKey.pubKey,
      lastAddress: pool2address,
    });
  });

  test('should reject connecting to its own addresses', async () => {
    const selfAddresses = ['::', '0.0.0.0', '::1', '127.0.0.1', 'localhost'];

    for (const address of selfAddresses) {
      await expect(
        pool.addOutbound(
          {
            host: address,
            port: poolPort,
          },
          '',
          false,
          false,
        ),
      ).rejects.toEqual(errors.ATTEMPTED_CONNECTION_TO_SELF);
    }
  });

  test('it rejects inbound peer because of pubKey mismatch (AuthFailureInvalidTarget)', async () => {
    const ownNodeState = {
      addresses: [
        { host: '1.1.1.1', port: poolPort },
        { host: '2.2.2.2', port: poolPort },
      ],
      pairs: [uuid()],
      connextIdentifier: uuid(),
      lndPubKeys: { BTC: uuid(), LTC: uuid() },
      lndUris: { BTC: [''], LTC: [''] },
      tokenIdentifiers: { BTC: 'bitcoin-testnet', LTC: 'litecoin-testnet' },
    };
    const ownNodeKey = await NodeKey['generate']();
    const expectedNodePubKey = (await NodeKey['generate']()).pubKey;
    await expect(
      remotePeer.beginOpen({
        ownNodeState,
        ownNodeKey,
        expectedNodePubKey,
        ownVersion: version,
        torport: 0,
      }),
    ).rejects.toHaveProperty('message', expect.stringContaining('AuthFailureInvalidTarget'));
  });

  test('it responds to inbound peer by beginning the handshake', async () => {
    const ownNodeState = {
      addresses: [
        { host: '1.1.1.1', port: poolPort },
        { host: '2.2.2.2', port: poolPort },
      ],
      pairs: [uuid()],
      connextIdentifier: uuid(),
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
      ownVersion: version,
      torport: 0,
    });
    expect(sessionInitPacket).toBeTruthy();
  });

  test('it rejects when already connected', async () => {
    expect(pool.peerCount).toEqual(0);
    expect(pool2.peerCount).toEqual(0);

    await pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);
    await awaitInboundPeer(pool2);

    await expect(pool2.addOutbound(pool1address, pool1nodeKey.pubKey, true, false)).rejects.toHaveProperty(
      'code',
      errorCodes.NODE_ALREADY_CONNECTED,
    );
    expect(pool.peerCount).toEqual(1);
    expect(pool2.peerCount).toEqual(1);
  });

  test('it connects exactly once if two peers attempt connections to each other simultaneously', async () => {
    expect(pool.peerCount).toEqual(0);
    expect(pool2.peerCount).toEqual(0);

    const pool1Promise = pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);
    const pool2Promise = pool2.addOutbound(pool1address, pool1nodeKey.pubKey, true, false);

    try {
      await pool1Promise;
      expect(pool.peerCount).toEqual(1);
    } catch (err) {
      // if an addOutbound call errors, it should be due to AlreadyConnected
      expect(err.code === errorCodes.NODE_ALREADY_CONNECTED || err.message.includes('AlreadyConnected'));
    }

    try {
      await pool2Promise;
    } catch (err) {
      // if an addOutbound call errors, it should be due to AlreadyConnected
      expect(err.code === errorCodes.NODE_ALREADY_CONNECTED || err.message.includes('AlreadyConnected'));
    }

    if (!pool.peerCount) {
      await awaitInboundPeer(pool);
    }
    if (!pool2.peerCount) {
      await awaitInboundPeer(pool2);
    }
    expect(pool.peerCount).toEqual(1);
    expect(pool2.peerCount).toEqual(1);
  });

  test('it rejects multiple outbound connections to same peer', async () => {
    expect(pool.peerCount).toEqual(0);
    expect(pool2.peerCount).toEqual(0);
    const firstOutboundAttempt = pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);
    const secondOutboundAttempt = pool.addOutbound(pool2address, pool2nodeKey.pubKey, true, false);

    await expect(secondOutboundAttempt).rejects.toHaveProperty('code', errorCodes.ALREADY_CONNECTING);
    await firstOutboundAttempt;

    expect(pool['pendingOutboundPeers'].size).toEqual(0);
    expect(pool.peerCount).toEqual(1);
  });
});
