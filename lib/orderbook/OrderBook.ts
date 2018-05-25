import uuidv1 from 'uuid/v1';

import OrderBookRepository, { Orders } from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import { orders, pairs, matchingEngine } from '../types';
import DB from '../db/DB';
import utils from '../utils/utils';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';

type OrderBookConfig = {
  internalmatching: boolean;
};

class OrderBook {
  logger: Logger = Logger.global;
  repository: OrderBookRepository;
  matchesProcessor: MatchesProcessor = new MatchesProcessor();
  pairs: pairs.dbPair[] = [];
  matchingEngines: {[ pairId: string ]: MatchingEngine} = {};

  constructor(private config: OrderBookConfig, db: DB, private pool?: Pool, private lndClient?: LndClient) {
    this.repository = new OrderBookRepository(db);
    if (pool) {
      pool.on('packet.order', this.addPeerOrder);
    }
  }

  async init() {
    const [pairs, peerOrders, ownOrders] = await Promise.all([
      this.repository.getPairs(),
      this.repository.getPeerOrders(),
      this.repository.getOwnOrders(),
    ]);

    const peerBuyOrdersByPairs = utils.groupBy(peerOrders.buyOrders, order => order.pairId);
    const peerSellOrdersByPairs = utils.groupBy(peerOrders.sellOrders, order => order.pairId);
    const ownBuyOrdersByPairs = utils.groupBy(ownOrders.buyOrders, order => order.pairId);
    const ownSellOrdersByPairs = utils.groupBy(ownOrders.sellOrders, order => order.pairId);

    pairs.forEach((pair) => {
      this.matchingEngines[pair.id] = new MatchingEngine(
        pair.id,
        this.config.internalmatching,
        peerBuyOrdersByPairs[pair.id],
        peerSellOrdersByPairs[pair.id],
        ownBuyOrdersByPairs[pair.id],
        ownSellOrdersByPairs[pair.id],
      );
    });

    this.pairs = pairs;
  }

  /**
   * Returns the list of available trading pairs.
   */
  public getPairs(): Promise<pairs.dbPair[]> {
    return this.repository.getPairs();
  }

  /**
   * Returns lists of buy and sell orders sorted by price.
   */
  public getOrders(pairId: string, maxResults: number): Promise<Orders> {
    return this.repository.getPeerOrders(pairId, maxResults);
  }

  public addOwnOrder = async (order: orders.OwnOrder): Promise<matchingEngine.MatchingResult>  => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }

    const stampedOrder: orders.StampedOwnOrder = { ...order, id: uuidv1(), createdAt: new Date() };
    const matchingResult = matchingEngine.matchOrAddOwnOrder(stampedOrder);
    const { matches, remainingOrder } = matchingResult;

    if (matches.length > 0) {
      matches.forEach(this.handleMatch);
    }
    if (remainingOrder) {
      this.broadcastOrder(remainingOrder);

      if (this.config.internalmatching) {
        const dbOrder = await this.repository.addOrder(stampedOrder);
        this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);
      }
    }

    return matchingResult;
  }

  public addPeerOrder = async (order: orders.PeerOrder): Promise<void> => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      this.logger.debug(`incoming peer order invalid pairId: ${order.pairId}`);
      return;
    }

    const stampedOrder: orders.StampedPeerOrder = { ...order, createdAt: new Date() };
    matchingEngine.addPeerOrder(stampedOrder);
    const dbOrder = await this.repository.addOrder(stampedOrder);
    this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);
  }

  private broadcastOrder = async (order: orders.StampedOwnOrder): Promise<void> => {
    if (!this.pool) {
      return;
    }
    const invoice = await this.getInvoice(order);
    if (!invoice) {
      return;
    }

    const { createdAt, ...outgoingOrder } = { ...order, invoice };
    this.pool.broadcastOrder(outgoingOrder);
  }

  private handleMatch = ({ maker, taker }): void => {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }

  private getInvoice = async (order: orders.StampedOwnOrder): Promise<string|void> => {
    if (!this.lndClient) {
      return;
    }

    if (this.lndClient.isDisabled()) {
      return 'dummyInvoice'; // temporarily testing invoices while lnd is not available
    } else {
      // temporary simple invoices until swaps are operational
      const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
      return invoice.paymentRequest;
    }
  }
}

export default OrderBook;
export { OrderBookConfig };
