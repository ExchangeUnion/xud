const Logger = require('../Logger');
const OrderBookRepository = require('./OrderBookRepository');
const MatchingEngine = require('./MatchingEngine');
const MatchesProcessor = require('./MatchesProcessor');
const utils = require('../utils/utils');

class OrderBook {
  constructor(db) {
    this.logger = Logger.global;
    this.repository = new OrderBookRepository(db);
    this.matchesProcessor = new MatchesProcessor();
    this.pairs = null;
    this.matchingEngines = null;

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

  getOrders() {
    return this.repository.getOrders();
  }

  async addOrder(order) {
    const matchingEngine = this.matchingEngines[order.pairId];
    const tsOrder = { ...order, createdAt: new Date() };
    const matches = matchingEngine.addOrder({ order: tsOrder, onMatch: this.handleMatch });
    if (matches) {
      matches.forEach(this.handleMatch);
    } else {
      await this.repository.addOrder(tsOrder);
      this.logger.debug(`order added: ${JSON.stringify(tsOrder)}`);
      if (order.peerId === null) {
        this.broadcastOrder(order);
      }
    }
  }

  broadcastOrder() { // eslint-disable-line class-methods-use-this
    // TODO: broadcast non-matched ownOrder to peers
  }

  handleMatch({ maker, taker }) {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }
}

module.exports = OrderBook;
