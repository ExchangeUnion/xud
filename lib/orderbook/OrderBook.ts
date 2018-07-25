import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import { orders, matchingEngine, db } from '../types';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';
import { ms } from '../utils/utils';
import Peer from '../p2p/Peer';
import { Models } from '../db/DB';

type Orders = {
  buyOrders: { [ id: string ]: orders.StampedOrder };
  sellOrders: { [ id: string ]: orders.StampedOrder };
};

class OrderBook extends EventEmitter {
  public pairs: db.PairInstance[] = [];
  public matchingEngines: { [ pairId: string ]: MatchingEngine } = {};

  private logger: Logger = Logger.orderbook;
  private repository: OrderBookRepository;
  private matchesProcessor: MatchesProcessor = new MatchesProcessor();

  private ownOrders: { [ pairId: string ]: Orders } = {};
  private peerOrders: { [ pairId: string ]: Orders } = {};

  constructor(models: Models, private pool?: Pool, private lndClient?: LndClient) {
    super();

    this.repository = new OrderBookRepository(models);
    if (pool) {
      pool.on('packet.order', this.addPeerOrder);
      pool.on('packet.getOrders', this.sendOrders);
    }
  }

  public init = async () => {
    const pairs = await this.repository.getPairs();

    pairs.forEach((pair) => {
      this.matchingEngines[pair.id] = new MatchingEngine(pair.id);
      this.ownOrders[pair.id] = this.initOrders();
      this.peerOrders[pair.id] = this.initOrders();
    });

    this.pairs = pairs;
  }

  private initOrders = (): Orders => {
    return {
      buyOrders: {},
      sellOrders: {},
    };
  }

  /**
   * Returns the list of available trading pairs.
   */
  public getPairs = (): Promise<db.PairInstance[]> => {
    return this.repository.getPairs();
  }

  /**
   * Returns lists of buy and sell orders of peers sorted by price.
   */
  public getPeerOrders = (pairId: string, maxResults: number): { [type: string]: orders.StampedOrder[] } => {
    return this.getOrders(maxResults, this.peerOrders[pairId]);
  }

  /*
  * Returns lists of the node's own buy and sell orders sorted by price.
  */
  public getOwnOrders = (pairId: string, maxResults: number): { [type: string]: orders.StampedOrder[] } => {
    return this.getOrders(maxResults, this.ownOrders[pairId]);
  }

  private getOrders = (maxResults: number, orders: Orders): { [ type: string ]: orders.StampedOrder[]} => {
    if (maxResults > 0) {
      return {
        buyOrders: Object.values(orders.buyOrders).slice(0, maxResults),
        sellOrders: Object.values(orders.sellOrders).slice(0, maxResults),
      };
    } else {
      return {
        buyOrders: Object.values(orders.buyOrders),
        sellOrders: Object.values(orders.sellOrders),
      };
    }
  }

  public addLimitOrder = (order: orders.OwnOrder): matchingEngine.MatchingResult => {
    return this.addOwnOrder(order);
  }

  public addMarketOrder = (order: orders.MarketOrder) => {
    const price = order.quantity > 0 ? Number.MAX_VALUE : 0;
    return this.addOwnOrder({ ...order, price }, true);
  }

  public removeOwnOrder = (orderId: string, pairId: string): boolean => {
    const matchingEngine = this.matchingEngines[pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(pairId);
    }

    if (matchingEngine.removeOwnOrder(orderId)) {
      return this.removeOrder(this.ownOrders, orderId, pairId);
    } else {
      return false;
    }
  }

  private addOwnOrder = (order: orders.OwnOrder, discardRemaining: boolean = false): matchingEngine.MatchingResult => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      throw errors.INVALID_PAIR_ID(order.pairId);
    }

    const stampedOrder: orders.StampedOwnOrder = { ...order, id: uuidv1(), createdAt: ms() };
    const matchingResult = matchingEngine.matchOrAddOwnOrder(stampedOrder, discardRemaining);
    const { matches, remainingOrder } = matchingResult;

    if (matches.length > 0) {
      matches.forEach(({ maker, taker }) => {
        this.handleMatch({ maker, taker });
        this.updateOrderQuantity(this.ownOrders, maker, maker.quantity);
      });
    }
    if (remainingOrder && !discardRemaining) {
      this.broadcastOrder(remainingOrder);
      this.addOrder(this.ownOrders, remainingOrder);
      this.logger.debug(`order added: ${JSON.stringify(remainingOrder)}`);

    }

    return matchingResult;
  }

  private addPeerOrder = (order: orders.PeerOrder) => {
    const matchingEngine = this.matchingEngines[order.pairId];
    if (!matchingEngine) {
      this.logger.debug(`incoming peer order invalid pairId: ${order.pairId}`);
      return;
    }

    const stampedOrder: orders.StampedPeerOrder = { ...order, createdAt: ms() };
    this.emit('peerOrder', order);
    matchingEngine.addPeerOrder(stampedOrder);
    this.addOrder(this.peerOrders, stampedOrder);
    this.logger.debug(`order added: ${JSON.stringify(stampedOrder)}`);
  }

  private updateOrderQuantity = (type: { [pairId: string]: Orders }, order: orders.StampedOrder, decreasedQuantity: number) => {
    const object = this.getOrderMap(type, order);
    object[order.id].quantity = object[order.id].quantity - decreasedQuantity;
    if (object[order.id].quantity === 0) {
      delete object[order.id];
    }
  }

  private addOrder = (type: { [pairId: string]: Orders }, order: orders.StampedOrder) => {
    this.getOrderMap(type, order)[order.id] = order;
  }

  private removeOrder = (type: { [pairId: string]: Orders }, orderId: string, pairId: string): boolean => {
    const orders = type[pairId];
    if (orders.buyOrders[orderId]) {
      delete orders.buyOrders[orderId];
      return true;
    } else if (orders.sellOrders[orderId]) {
      delete orders.sellOrders[orderId];
      return true;
    }
    return false;
  }

  private getOrderMap = (type: { [pairId: string]: Orders }, order: orders.StampedOrder): { [ id: string ]: orders.StampedOrder } => {
    const orders = type[order.pairId];
    if (order.quantity > 0) {
      return orders.buyOrders;
    } else {
      return orders.sellOrders;
    }
  }

  private sendOrders = async (peer: Peer) => {
    // TODO: just send supported pairs
    const pairs = await this.getPairs();

    const promises: Promise<orders.OutgoingOrder | void>[] = [];
    for (const { id } of pairs) {
      const orders = await this.getOwnOrders(id, 0);
      Object.values(orders.buyOrders).forEach(order => promises.push(this.createOutgoingOrder(order)));
      Object.values(orders.sellOrders).forEach(order => promises.push(this.createOutgoingOrder(order)));
    }
    await Promise.all(promises).then((outgoingOrders) => {
      peer.sendOrders(outgoingOrders as orders.OutgoingOrder[]);
    });
  }

  private broadcastOrder = async (order: orders.StampedOwnOrder): Promise<void> => {
    if (this.pool) {
      const outgoingOrder = await this.createOutgoingOrder(order);

      if (outgoingOrder) {
        this.pool.broadcastOrder(outgoingOrder);
      }
    }
  }

  private createOutgoingOrder = async (order: orders.StampedOwnOrder): Promise<orders.OutgoingOrder | void> => {
    const invoice = await this.createInvoice(order);

    if (!invoice) return;

    const { createdAt, ...outgoingOrder } = { ...order, invoice };
    return outgoingOrder;
  }

  private handleMatch = ({ maker, taker }): void => {
    this.logger.debug(`order match: ${JSON.stringify({ maker, taker })}`);
    this.matchesProcessor.add({ maker, taker });
  }

  public createInvoice = async (order: orders.StampedOwnOrder): Promise<string|void> => {
    if (!this.lndClient) {
      return;
    }

    if (this.lndClient.isDisabled()) {
      return 'dummyInvoice'; // temporarily testing invoices while lnd is not available
    } else {
      // temporary simple invoices until swaps are operational
      const invoice = await this.lndClient.addInvoice(order.price * Math.abs(order.quantity));
      return invoice.paymentRequest;
    }
  }
}

export default OrderBook;
export { Orders };
