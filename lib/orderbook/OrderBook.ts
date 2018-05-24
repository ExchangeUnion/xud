import uuidv1 from 'uuid/v1';

import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import utils from '../utils/utils';
import Logger from '../Logger';

type Order = {
  price: number;
  quantity: number;
  pairId: string;
  peerId: any;
  invoice: string;
};

type Orders = {
  buyOrders: Order[];
  sellOrders: Order[];
};

class OrderBook {
  logger: any;
  repository: OrderBookRepository;
  matchesProcessor: MatchesProcessor;
  pairs: any;
  matchingEngines: any;

  constructor(db, private pool: Pool) {
    this.logger = Logger.global;
    this.repository = new OrderBookRepository(db);
    this.matchesProcessor = new MatchesProcessor();
    this.pairs = null;
    this.matchingEngines = null;

    if (pool) {
      this.pool = pool;
      this.pool.on('neworder', this.addOrder);
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

    const buyOrdersByPairs = utils.groupBy(orders.buyOrders, order => order.pairId);
    const ownBuyOrdersByPairs = utils.groupBy(ownOrders.buyOrders, order => order.pairId);
    const sellOrdersByPairs = utils.groupBy(orders.sellOrders, order => order.pairId);
    const ownSellOrdersByPairs = utils.groupBy(ownOrders.sellOrders, order => order.pairId);

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

  /**
   * Returns lists of buy and sell orders sorted by price.
   */
  getOrders(pairId: string, maxResults: number): Promise<Orders> {
    return this.repository.getOrders(pairId, maxResults);
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
    if (this.pool) {
      this.pool.broadcastOrder(order);
    }
  }

  handleMatch({ maker, taker }) {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }
}

export default OrderBook;
export { Order, Orders };
