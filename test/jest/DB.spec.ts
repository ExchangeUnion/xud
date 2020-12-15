import { SwapClientType, SwapPhase, SwapRole, SwapState, XuNetwork } from '../../lib/constants/enums';
import DB from '../../lib/db/DB';
import { defaultCurrencies, defaultNodes, defaultPairs } from '../../lib/db/seeds';
import { TradeCreationAttributes } from '../../lib/db/types';
import Logger, { Level } from '../../lib/Logger';
import OrderBookRepository from '../../lib/orderbook/OrderBookRepository';
import P2PRepository from '../../lib/p2p/P2PRepository';
import SwapRepository from '../../lib/swaps/SwapRepository';
import { SwapDeal } from '../../lib/swaps/types';
import { createOwnOrder } from '../utils';

const pairId = 'LTC/BTC';
const loggers = Logger.createLoggers(Level.Warn);

const price = 0.005;
const quantity = 10000000;
const peerPubKey = '03029c6a4d80c91da9e40529ec41c93b17cc9d7956b59c7d8334b0318d4a86aef8';
const rHash = '62c8bbef4587cff4286246e63044dc3e454b5693fb5ebd0171b7e58644bfafe2';

const order = createOwnOrder(price, quantity, true);
const orderId = order.id;

const deal: SwapDeal = {
  quantity,
  price,
  peerPubKey,
  rHash,
  pairId,
  role: SwapRole.Maker,
  phase: SwapPhase.PaymentReceived,
  state: SwapState.Completed,
  orderId: order.id,
  localId: order.localId,
  isBuy: order.isBuy,
  proposedQuantity: quantity,
  takerCurrency: 'BTC',
  makerCurrency: 'LTC',
  takerAmount: 5000,
  makerAmount: 1000000,
  takerUnits: 5000n,
  makerUnits: 1000000n,
  takerCltvDelta: 144,
  makerCltvDelta: 144,
  rPreimage: '60743C0B6BFA885E30F101705764F43F8EF7E613DD0F07AD5178C7D9B1682B9E',
  createTime: 1540716251106,
  executeTime: 1540717251106,
  completeTime: 1540718251106,
};

describe('Database', () => {
  let db: DB;
  let orderBookRepo: OrderBookRepository;
  let p2pRepo: P2PRepository;
  let swapRepo: SwapRepository;

  describe('initDb', () => {
    const network = XuNetwork.SimNet;
    const simnetNodes = defaultNodes(network)!;
    const simnetCurrencies = defaultCurrencies(network)!;
    const simnetPairs = defaultPairs(network)!;

    beforeEach(() => {
      db = new DB(loggers.db);
      orderBookRepo = new OrderBookRepository(db.models);
      p2pRepo = new P2PRepository(db.models);
      swapRepo = new SwapRepository(db.models);
    });

    it('should init the database from scratch', async () => {
      await db.init(network, true);
      const [nodes, currencies, pairs] = await Promise.all([
        p2pRepo.getNodes(),
        orderBookRepo.getCurrencies(),
        orderBookRepo.getPairs(),
      ]);

      expect(nodes.length).toEqual(simnetNodes.length);
      nodes.forEach((node, index) => {
        const simnetNode = simnetNodes[index];
        expect(node.nodePubKey).toEqual(simnetNode.nodePubKey);
        expect(node.addresses).toEqual(simnetNode.addresses);
      });

      expect(currencies.length).toEqual(simnetCurrencies.length);
      currencies.forEach((currency, index) => {
        const simnetCurrency = simnetCurrencies[index];
        expect(currency.id).toEqual(simnetCurrency.id);
        expect(currency.tokenAddress ?? undefined).toEqual(simnetCurrency.tokenAddress);
      });

      expect(pairs.length).toEqual(simnetPairs.length);
      pairs.forEach((pair, index) => {
        const simnetPair = simnetPairs[index];
        expect(pair.baseCurrency).toEqual(simnetPair.baseCurrency);
        expect(pair.quoteCurrency).toEqual(simnetPair.quoteCurrency);
      });
    });

    it('should add new default values to an existing db', async () => {
      await db.init();

      await Promise.all([
        orderBookRepo.addCurrency({
          id: 'ABC',
          swapClient: SwapClientType.Connext,
          decimalPlaces: 4,
        }),
        orderBookRepo.addCurrency({
          id: 'XYZ',
          swapClient: SwapClientType.Connext,
          decimalPlaces: 18,
        }),
        p2pRepo.addNodeIfNotExists({
          nodePubKey: peerPubKey,
          addresses: [],
        }),
      ]);
      await orderBookRepo.addPair({
        baseCurrency: 'ABC',
        quoteCurrency: 'XYZ',
      });
      await expect(orderBookRepo.getCurrencies()).resolves.toHaveLength(2);
      await expect(orderBookRepo.getPairs()).resolves.toHaveLength(1);
      await expect(p2pRepo.getNodes()).resolves.toHaveLength(1);

      await db.init(network, true);

      const [nodes, currencies, pairs] = await Promise.all([
        p2pRepo.getNodes(),
        orderBookRepo.getCurrencies(),
        orderBookRepo.getPairs(),
      ]);

      expect(nodes.length).toEqual(simnetNodes.length + 1);
      simnetNodes.forEach((simnetNode, index) => {
        const node = nodes[index + 1];
        expect(node.nodePubKey).toEqual(simnetNode.nodePubKey);
        expect(node.addresses).toEqual(simnetNode.addresses);
      });

      expect(currencies.length).toEqual(simnetCurrencies.length + 2);
      simnetCurrencies.forEach((simnetCurrency, index) => {
        const currency = currencies[index + 2];
        expect(currency.id).toEqual(simnetCurrency.id);
        expect(currency.tokenAddress ?? undefined).toEqual(simnetCurrency.tokenAddress);
      });

      expect(pairs.length).toEqual(simnetPairs.length + 1);
      simnetPairs.forEach((simnetPair, index) => {
        const pair = pairs[index + 1];
        expect(pair.baseCurrency).toEqual(simnetPair.baseCurrency);
        expect(pair.quoteCurrency).toEqual(simnetPair.quoteCurrency);
      });
    });

    afterEach(async () => {
      await db.close();
    });
  });

  describe('CRUD operations', () => {
    beforeAll(async () => {
      db = new DB(loggers.db);
      await db.init();
      orderBookRepo = new OrderBookRepository(db.models);
      p2pRepo = new P2PRepository(db.models);
      swapRepo = new SwapRepository(db.models);
    });

    it('should add two currencies', async () => {
      const btcPromise = orderBookRepo.addCurrency({
        id: 'BTC',
        swapClient: SwapClientType.Lnd,
        decimalPlaces: 8,
      });
      const ltcPromise = orderBookRepo.addCurrency({
        id: 'LTC',
        swapClient: SwapClientType.Lnd,
        decimalPlaces: 8,
      });
      await Promise.all([btcPromise, ltcPromise]);
      await expect(orderBookRepo.getCurrencies()).resolves.toHaveLength(2);
    });

    it('should add a trading pair', async () => {
      await orderBookRepo.addPair({
        baseCurrency: 'LTC',
        quoteCurrency: 'BTC',
      });
      await expect(orderBookRepo.getPairs()).resolves.toHaveLength(1);
    });

    it('should add a node', async () => {
      await p2pRepo.addNodeIfNotExists({
        nodePubKey: peerPubKey,
        addresses: [],
      });
    });

    it('should add an order', async () => {
      await orderBookRepo.addOrderIfNotExists(order);
      await expect(db.models.Order.count()).resolves.toEqual(1);
    });

    it('should not add the same order twice', async () => {
      await orderBookRepo.addOrderIfNotExists(order);
      await expect(db.models.Order.count()).resolves.toEqual(1);
    });

    it('should add a swap and a trade for the order', async () => {
      await orderBookRepo.addOrderIfNotExists(order);
      const { rHash } = deal;
      const trade: TradeCreationAttributes = {
        rHash,
        quantity: deal.quantity!,
        makerOrderId: order.id,
      };
      await orderBookRepo.addTrade(trade);
      await swapRepo.saveSwapDeal(deal);

      const swapInstance = await db.models.SwapDeal.findOne({
        where: { rHash },
      });
      expect(swapInstance!.orderId).toEqual(order.id);
      const tradeInstance = await db.models.Trade.findOne({ where: { rHash } });
      expect(tradeInstance!.makerOrderId).toEqual(order.id);
    });

    it('should get a swap along with the order for the swap', async () => {
      const swap = (await swapRepo.getSwapDeal(rHash))!;
      expect(swap.Order!.id).toEqual(orderId);
      const order = (await swap.getOrder())!;
      expect(order.id).toEqual(orderId);
    });

    it('should get a swap along with its peer node', async () => {
      const swap = (await swapRepo.getSwapDeal(rHash))!;
      expect(swap.peerPubKey).toEqual(peerPubKey);
      const node = (await swap.getNode())!;
      expect(node.nodePubKey).toEqual(peerPubKey);
    });

    it('should add market orders and have their price in db be null', async () => {
      const buyMarketOrder = createOwnOrder(Number.POSITIVE_INFINITY, quantity, true);
      const sellMarketOrder = createOwnOrder(0, quantity, true);
      await orderBookRepo.addOrderIfNotExists(buyMarketOrder);
      await orderBookRepo.addOrderIfNotExists(sellMarketOrder);
      const buyOrder = (await db.models.Order.findByPk(buyMarketOrder.id))!;
      const sellOrder = (await db.models.Order.findByPk(sellMarketOrder.id))!;
      expect(buyOrder.id).toEqual(buyMarketOrder.id);
      expect(sellOrder.id).toEqual(sellMarketOrder.id);
      expect(buyOrder.price).toBeNull();
      expect(sellOrder.price).toBeNull();
    });

    it('should add two own orders and a trade between them', async () => {
      const tradeQuantity = 10000000;
      const maker = createOwnOrder(price, tradeQuantity, true);
      const taker = createOwnOrder(price, tradeQuantity, false);
      await Promise.all([orderBookRepo.addOrderIfNotExists(maker), orderBookRepo.addOrderIfNotExists(taker)]);
      const trade: TradeCreationAttributes = {
        quantity: tradeQuantity,
        makerOrderId: maker.id,
        takerOrderId: taker.id,
      };
      await orderBookRepo.addTrade(trade);
    });

    afterAll(async () => {
      await db.close();
    });
  });
});
