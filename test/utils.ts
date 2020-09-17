import fs from 'fs';
import net from 'net';
import os from 'os';
import path from 'path';
import { SinonSpy } from 'sinon';
import uuidv1 from 'uuid';
import { SwapPhase, SwapRole, SwapState } from '../lib/constants/enums';
import { OwnOrder, PeerOrder } from '../lib/orderbook/types';
import { UnitConverter } from '../lib/utils/UnitConverter';
import { ms } from '../lib/utils/utils';

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

export const createOwnOrder = (
  price: number,
  quantity: number,
  isBuy: boolean,
  createdAt = ms(),
  pairId = 'LTC/BTC',
): OwnOrder => ({
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

export const getValidDeal = (phase = SwapPhase.SendingPayment, role = SwapRole.Maker) => {
  return {
    phase,
    role,
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
    makerUnits: 10000n,
    takerAmount: 1000,
    takerUnits: 1000n,
    makerCurrency: 'LTC',
    takerCurrency: 'BTC',
    destination: '034c5266591bff232d1647f45bcf6bbc548d3d6f70b2992d28aba0afae067880ac',
    peerPubKey: '021ea6d67c850a0811b01c78c8117dca044b224601791a4186bf5748f667f73517',
    localId: '53bc8a30-81f0-11e9-9259-a5617f44d209',
    state: SwapState.Active,
    createTime: 1559120485138,
    takerMaxTimeLock: 100,
  };
};

export const getUnitConverter = (): UnitConverter =>
  new UnitConverter([
    { id: 'BTC', decimalPlaces: 8, swapClient: 0 },
    { id: 'LTC', decimalPlaces: 8, swapClient: 0 },
    { id: 'ETH', decimalPlaces: 18, swapClient: 2 },
    { id: 'USDT', decimalPlaces: 6, swapClient: 2 },
    { id: 'XUC', decimalPlaces: 18, swapClient: 2 },
  ]);
