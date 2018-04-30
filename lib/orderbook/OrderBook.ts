import uuidv1 from 'uuid/v1';

import utils from '../utils/utils';
import Logger from '../Logger';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';

class OrderBook {
  logger: any;
  repository: OrderBookRepository;
  matchesProcessor: MatchesProcessor;
  pairs: any;
  matchingEngines: any;
  p2p: any;

  constructor(db, p2p) {
    this.logger = Logger.global;
    this.repository = new OrderBookRepository(db);
    this.matchesProcessor = new MatchesProcessor();
    this.pairs = null;
    this.matchingEngines = null;

    if (p2p) {
      this.p2p = p2p;
      this.p2p.on('neworder', this.addOrder);
    }

    this.getOrders = this.getOrders.bind(this);
    this.addOrder = this.addOrder.bind(this);
    this.handleMatch = this.handleMatch.bind(this);
  }

  async init() {
    const [pairs, orders, ownOrders] = await Promise.all([
      this.repository.getPairs(),
      this.repository.getOrders(),
      this.repository.getOwnOrders(),
    ]);

    const buyOrdersByPairs = utils.groupBy(orders.buy, order => order.pairId);
    const ownBuyOrdersByPairs = utils.groupBy(ownOrders.buy, order => order.pairId);
    const sellOrdersByPairs = utils.groupBy(orders.sell, order => order.pairId);
    const ownSellOrdersByPairs = utils.groupBy(ownOrders.sell, order => order.pairId);

    this.matchingEngines = {};
    pairs.forEach((pair) => {
      this.matchingEngines[pair.id] = new MatchingEngine(
        pair.id,
        buyOrdersByPairs[pair.id],
        ownBuyOrdersByPairs[pair.id],
        sellOrdersByPairs[pair.id],
        ownSellOrdersByPairs[pair.id],
      );
    });

    this.pairs = pairs;
  }

  getPairs() {
    return this.repository.getPairs();
  }

  getOrders() {
    return this.repository.getOrders();
  }

  async addOrder(order) {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }
    const stampedOrder = { ...order, id: uuidv1(), createdAt: new Date() };
    const matches = matchingEngine.addOrder({ order: stampedOrder, onMatch: this.handleMatch });
    if (matches) {
      matches.forEach(this.handleMatch);
      return { matches };
    } else {
      const dbOrder = await this.repository.addOrder(stampedOrder);
      this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);
      if (!order.peerId) {
        this.broadcastOrder(order);
      }
      return dbOrder;
    }
  }

  broadcastOrder(order) {
    if (this.p2p) {
      this.p2p.broadcastOrder(order);
    }
  }

  handleMatch({ maker, taker }) {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }
}

export default OrderBook;
