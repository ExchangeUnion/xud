import net from 'net';
import { SinonSpy } from 'sinon';
import { ms } from '../lib/utils/utils';
import { PeerOrder, OwnOrder } from '../lib/orderbook/types';
import uuidv1 from 'uuid';

/**
 * Discovers and returns a dynamically assigned, unused port available for testing.
 */
export const getUnusedPort = async () => {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, () => {
      const { port } = server.address();
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
