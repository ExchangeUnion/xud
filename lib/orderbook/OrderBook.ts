import uuidv1 from 'uuid/v1';

import OrderBookRepository, { Orders } from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, matchingEngine, db } from '../types';
import DB from '../db/DB';
import { groupBy } from '../utils/utils';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';

type OrderBookConfig = {
  internalmatching: boolean;
};

class OrderBook {
  private logger: Logger = Logger.orderbook;
  private repository: OrderBookRepository;
  private matchesProcessor: MatchesProcessor = new MatchesProcessor();
  public pairs: db.PairInstance[] = [];
  public matchingEngines: {[ pairId: string ]: MatchingEngine} = {};

  constructor(private config: OrderBookConfig, db: DB, private pool?: Pool, private lndClient?: LndClient) {
    this.repository = new OrderBookRepository(db);
    if (pool) {
      pool.on('packet.order', this.addPeerOrder);
      pool.on('peer.destroy', this.removePeerOrders);
    }
  }

  public async init() {
    const [pairs, peerOrders, ownOrders] = await Promise.all([
      this.repository.getPairs(),
      this.repository.getPeerOrders(),
      this.repository.getOwnOrders(),
    ]);

    const peerBuyOrdersByPairs = groupBy(peerOrders.buyOrders, order => order.pairId);
    const peerSellOrdersByPairs = groupBy(peerOrders.sellOrders, order => order.pairId);
    const ownBuyOrdersByPairs = groupBy(ownOrders.buyOrders, order => order.pairId);
    const ownSellOrdersByPairs = groupBy(ownOrders.sellOrders, order => order.pairId);

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
  public getPairs(): Promise<db.PairInstance[]> {
    return this.repository.getPairs();
  }

  /**
   * Returns lists of buy and sell orders of peers sorted by price.
   */
  public getPeerOrders(pairId: string, maxResults: number): Promise<Orders> {
    return this.repository.getPeerOrders(pairId, maxResults);
  }

  /*
  * Returns lists of the node's own buy and sell orders sorted by price.
  */
  public getOwnOrders(pairId: string, maxResults: number): Promise<Orders> {
    return this.repository.getOwnOrders(pairId, maxResults);
  }

  public addLimitOrder = async (order: orders.OwnOrder): Promise<matchingEngine.MatchingResult>  => {
    return this.addOwnOrder(order);
  }

  public addMarketOrder = async (_order: orders.OwnOrder) => {
    // TODO: implement
  }

  private addOwnOrder = async (order: orders.OwnOrder): Promise<matchingEngine.MatchingResult>  => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }

    const stampedOrder: orders.StampedOwnOrder = { ...order, id: uuidv1(), createdAt: new Date() };
    const matchingResult = matchingEngine.matchOrAddOwnOrder(stampedOrder);
    const { matches, remainingOrder } = matchingResult;

    if (matches.length > 0) {
      const updatedOrders: Promise<void>[] = [];
      for (const { maker, taker } of matches) {
        this.handleMatch({ maker, taker });
        updatedOrders.push(this.repository.updateOrderQuantity(maker.id, maker.quantity));
      }
      await Promise.all(updatedOrders);
    }
    if (remainingOrder) {
      this.broadcastOrder(remainingOrder);

      if (this.config.internalmatching) {
        const dbOrder = await this.repository.addOrder(<db.OrderFactory>remainingOrder);
        this.logger.debug(`order added: ${JSON.stringify(dbOrder)}`);
      }
    }

    return matchingResult;
  }

  private addPeerOrder = async (order: orders.PeerOrder): Promise<void> => {
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

  private removePeerOrders = async (peer: Peer): Promise<void> => {
    this.pairs.forEach((pair) => {
      this.matchingEngines[pair.id].dropPeerOrders(peer.getHostId());
    });
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
