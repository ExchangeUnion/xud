import uuidv1 from 'uuid/v1';
import { EventEmitter } from 'events';
import OrderBookRepository from './OrderBookRepository';
import MatchingEngine from './MatchingEngine';
import MatchesProcessor from './MatchesProcessor';
import errors from './errors';
import Pool from '../p2p/Pool';
import Peer from '../p2p/Peer';
import { orders, matchingEngine, db } from '../types';
import Logger from '../Logger';
import LndClient from '../lndclient/LndClient';
import { ms } from '../utils/utils';
import { Models } from '../db/DB';

type OrdersMap = Map<String, Orders>;

type Orders = {
  buyOrders: Map<String, orders.StampedOrder>;
  sellOrders: Map<String, orders.StampedOrder>;
};

interface OrderBook {
  on(event: 'peerOrder', listener: (order: orders.StampedPeerOrder) => void);
  emit(event: 'peerOrder', order: orders.StampedPeerOrder);
}

type OrderArrays = {
  buyOrders: orders.StampedOrder[],
  sellOrders: orders.StampedOrder[],
};

class OrderBook extends EventEmitter {
  public pairs: db.PairInstance[] = [];
  public matchingEngines: { [ pairId: string ]: MatchingEngine } = {};

  private logger: Logger = Logger.orderbook;
  private repository: OrderBookRepository;
  private matchesProcessor: MatchesProcessor = new MatchesProcessor();

  private ownOrders: OrdersMap = new Map<String, Orders>();
  private peerOrders: OrdersMap = new Map<String, Orders>();

  /**
   * A map between an order's local id and global id
   */
  private localIdMap: Map<String, String> = new Map<String, String>();

  constructor(models: Models, private pool?: Pool, private lndClient?: LndClient) {
    super();

    this.repository = new OrderBookRepository(models);
    if (pool) {
      pool.on('packet.order', this.addPeerOrder);
      pool.on('packet.orderInvalidation', body => this.removePeerOrder(body.orderId, body.pairId)); // TODO: implement quantity invalidation
      pool.on('packet.getOrders', this.sendOrders);
      pool.on('peer.close', this.removePeerOrders);

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
      buyOrders: new Map <String, orders.StampedOrder>(),
      sellOrders: new Map <String, orders.StampedOrder>(),
    };
  }

  /**
   * Returns the list of available trading pairs.
   */
  public getPairs = (): Promise<db.PairInstance[]> => {
    return this.repository.getPairs();
  }

  /**
   * Returns lists of buy and sell orders of peers
   */
  public getPeerOrders = (pairId: string, maxResults: number): OrderArrays => {
    return this.getOrders(maxResults, this.peerOrders[pairId]);
  }

  /*
  * Returns lists of the node's own buy and sell orders
  */
  public getOwnOrders = (pairId: string, maxResults: number): OrderArrays => {
    return this.getOrders(maxResults, this.ownOrders[pairId]);
  }

  private getOrders = (maxResults: number, orders: Orders): OrderArrays => {
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

  public addMarketOrder = (order: orders.OwnMarketOrder): matchingEngine.MatchingResult => {
    const price = order.quantity > 0 ? Number.MAX_VALUE : 0;
    return this.addOwnOrder({ ...order, price }, true);
  }

  public removeOwnOrderByLocalId = (pairId: string, localId: string): boolean => {
    const id = this.localIdMap[localId];

    if (id === undefined) {
      return false;
    } else {
      delete this.localIdMap[localId];
      return this.removeOwnOrder(pairId, id);
    }
  }

  private removeOwnOrder = (pairId: string, orderId: string): boolean => {
    const matchingEngine = this.matchingEngines[pairId];
    if (!matchingEngine) {
      this.logger.warn(`Invalid pairId: ${pairId}`);
      return false;
    }

    if (matchingEngine.removeOwnOrder(orderId)) {
      this.logger.debug(`order removed: ${JSON.stringify(orderId)}`);
      return this.removeOrder(this.ownOrders, orderId, pairId);
    } else {
      return false;
    }
  }

  private removePeerOrder = (orderId: string, pairId: string): boolean => {
    const matchingEngine = this.matchingEngines[pairId];
    if (!matchingEngine) {
      this.logger.warn(`Invalid pairId: ${pairId}`);
      return false;
    }

    if (matchingEngine.removePeerOrder(orderId)) {
      return this.removeOrder(this.peerOrders, orderId, pairId);
    } else {
      return false;
    }
  }

  private addOwnOrder = (order: orders.OwnOrder, discardRemaining: boolean = false): matchingEngine.MatchingResult => {
    if (this.localIdMap[order.localId]) {
      throw errors.DUPLICATED_ORDER(order.localId);
    }

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
    this.emit('peerOrder', stampedOrder);
    matchingEngine.addPeerOrder(stampedOrder);
    this.addOrder(this.peerOrders, stampedOrder);
    this.logger.debug(`order added: ${JSON.stringify(stampedOrder)}`);
  }

  private removePeerOrders = async (peer: Peer): Promise<void> => {
    this.pairs.forEach((pair) => {
      this.matchingEngines[pair.id].removePeerOrders(peer.id);
    });
  }

  private updateOrderQuantity = (type: OrdersMap, order: orders.StampedOrder, decreasedQuantity: number) => {
    const orderMap = this.getOrderMap(type, order);

    orderMap[order.id].quantity = orderMap[order.id].quantity - decreasedQuantity;
    if (orderMap[order.id].quantity === 0) {
      if (this.isOwnOrder(type)) {
        const { localId } = order as orders.StampedOwnOrder;
        delete this.localIdMap[localId];
      }
      delete orderMap[order.id];
    }
  }

  private addOrder = (type: OrdersMap, order: orders.StampedOrder) => {
    if (this.isOwnOrder(type)) {
      const { localId } = order as orders.StampedOwnOrder;
      this.localIdMap[localId] = order.id;
    }

    this.getOrderMap(type, order)[order.id] = order;
  }

  private removeOrder = (type: OrdersMap, orderId: string, pairId: string): boolean => {
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

  private getOrderMap = (type: OrdersMap, order: orders.StampedOrder): OrdersMap => {
    const orders = type[order.pairId];
    if (order.quantity > 0) {
      return orders.buyOrders;
    } else {
      return orders.sellOrders;
    }
  }

  private isOwnOrder = (type: OrdersMap) => {
    return type === this.ownOrders;
  }

  private sendOrders = async (peer: Peer, reqId: string) => {
    // TODO: just send supported pairs
    const pairs = await this.getPairs();

    const promises: Promise<orders.OutgoingOrder | void>[] = [];
    for (const { id } of pairs) {
      const orders = await this.getOwnOrders(id, 0);
      orders['buyOrders'].forEach(order => promises.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
      orders['sellOrders'].forEach(order => promises.push(this.createOutgoingOrder(order as orders.StampedOwnOrder)));
    }
    await Promise.all(promises).then((outgoingOrders) => {
      peer.sendOrders(outgoingOrders as orders.OutgoingOrder[], reqId);
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

    const { createdAt, localId, ...outgoingOrder } = { ...order, invoice };
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
export { Orders, OrderArrays };
