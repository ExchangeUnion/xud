import uuidv1 from 'uuid/v1';

import OrderBookRepository, { Orders } from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import { OwnOrder, StampedOwnOrder, PeerOrder, StampedPeerOrder, OutgoingOrder } from '../types';
import utils from '../utils/utils';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';

class OrderBook {
  logger: any;
  repository: OrderBookRepository;
  matchesProcessor: MatchesProcessor;
  pairs: any;
  matchingEngines: any;

  constructor(db, private pool: Pool, private lndClient: LndClient) {
    this.logger = Logger.global;
    this.repository = new OrderBookRepository(db);
    this.matchesProcessor = new MatchesProcessor();
    this.pairs = null;
    this.matchingEngines = null;

    this.getOrders = this.getOrders.bind(this);
    this.addOwnOrder = this.addOwnOrder.bind(this);
    this.addPeerOrder = this.addPeerOrder.bind(this);
    this.handleMatch = this.handleMatch.bind(this);

    if (pool) {
      this.pool = pool;
      this.pool.on('packet.order', this.addPeerOrder);
    }
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
  getOrders(): Promise<Orders> {
    return this.repository.getOrders();
  }

  async addOwnOrder(order: OwnOrder) {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }
    const stampedOrder: StampedOwnOrder = { ...order, id: uuidv1(), createdAt: new Date() };
    const matches = matchingEngine.addOrder({ order: stampedOrder, onMatch: this.handleMatch });
    if (matches) {
      matches.forEach(this.handleMatch);
      return { matches };
    } else {
      const dbOrder = await this.repository.addOrder(stampedOrder);
      this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);

      this.broadcastOrder(stampedOrder);
      return dbOrder;
    }
  }

  async addPeerOrder(order: PeerOrder) {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      this.logger.debug(`incoming peer order invalid pairId: ${order.pairId}`);
      return;
    }

    const stampedOrder: StampedPeerOrder = { ...order, createdAt: new Date() };
    const matches = matchingEngine.addOrder({ order: stampedOrder, onMatch: this.handleMatch });
    if (matches) {
      matches.forEach(this.handleMatch);
      return { matches };
    } else {
      const dbOrder = await this.repository.addOrder(stampedOrder);
      this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);
      return dbOrder;
    }
  }

  async broadcastOrder(order: StampedOwnOrder) {
    if (!this.pool) {
      return;
    }
    const invoice = await this.getInvoice(order);
    if (!invoice) {
      return;
    }

    const { createdAt, ...outgoingOrder } = { ...order, invoice };
    this.pool.broadcastOrder(<OutgoingOrder>outgoingOrder);
  }

  handleMatch({ maker, taker }) {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }

  async getInvoice(order: StampedOwnOrder): Promise<string|null> {
    if (!this.lndClient.isDisabled()) {
      // temporary simple invoices until swaps are operational
      const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
      return invoice.paymentRequest;
    } else {
      return 'dummyInvoice'; // temporarily testing invoices while lnd is not available
    }
  }
}

export default OrderBook;
