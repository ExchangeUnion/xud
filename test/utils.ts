import net from 'net';
import { SinonSpy } from 'sinon';
import uuidv1 from 'uuid';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { ms } from '../lib/utils/utils';
import { PeerOrder, OwnOrder } from '../lib/orderbook/types';

/**
 * Discovers and returns a dynamically assigned, unused port available for testing.
 */
export const getUnusedPort = async () => {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => {
        resolve(port);
      });
    });
  });
};

/**
 * Returns a promise wrapper for the spy's property to be truthy
 * @param spy a spy to recursively check.
 * @param property a property that has to eventually become truthy
 * @returns a spy, rejects otherwise.
 */
export const waitForSpy = (spy: SinonSpy, property = 'called') => {
  return new Promise((resolve, reject) => {
    try {
      const checkSpy = (spy: any) => {
        if (spy[property]) return resolve(spy);
        return setTimeout(() => checkSpy(spy));
      };
      checkSpy(spy);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Creates and returns an os-specific directory for temp files.
 */
export const getTempDir = (unique: boolean) => {
  let dir = path.join(os.tmpdir(), 'xud-test');
  if (unique) {
    dir = path.join(dir, uuidv1());
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return dir;
};

export const createOwnOrder = (price: number, quantity: number, isBuy: boolean, createdAt = ms(), pairId = 'LTC/BTC'): OwnOrder => ({
  price,
  quantity,
  isBuy,
  pairId,
  createdAt,
  initialQuantity: quantity,
  id: uuidv1(),
  localId: uuidv1(),
  hold: 0,
});

export const createPeerOrder = (
  price: number,
  quantity: number,
  isBuy: boolean,
  createdAt = ms(),
  peerPubKey = '029a96c975d301c1c8787fcb4647b5be65a3b8d8a70153ff72e3eac73759e5e345',
  pairId = 'LTC/BTC',
): PeerOrder => ({
  quantity,
  price,
  isBuy,
  pairId,
  createdAt,
  peerPubKey,
  initialQuantity: quantity,
  id: uuidv1(),
});

export const getValidDeal = () => {
  return {
    proposedQuantity: 10000,
    pairId: 'LTC/BTC',
    orderId: '53bc8a30-81f0-11e9-9259-a5617f44d209',
    rHash: '04b6ac45b770ec4abbb9713aebfa57b963a1f6c7a795d9b5757687e0688add80',
    takerCltvDelta: 40,
    makerCltvDelta: 576,
    takerPubKey: '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac',
    price: 0.1,
    isBuy: true,
    quantity: 10000,
    makerAmount: 10000,
    makerUnits: 10000,
    takerAmount: 1000,
    takerUnits: 1000,
    makerCurrency: 'LTC',
    takerCurrency: 'BTC',
    destination: '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac',
    peerPubKey: '021ea6d67c850a0811b01c78c8117dca044b224601791a4186bf5748f667f73517',
    localId: '53bc8a30-81f0-11e9-9259-a5617f44d209',
    phase: 3,
    state: 0,
    role: 1,
    createTime: 1559120485138,
    makerToTakerRoutes: [{ getTotalTimeLock: () => {} }],
  };
};
