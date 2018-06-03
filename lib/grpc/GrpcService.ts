import assert from 'assert';
import { GrpcComponents } from './GrpcServer';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import { orders, matchingEngine } from '../types';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';

/** Class containing the available RPC methods for Exchange Union */
class GrpcService {
  private orderBook: OrderBook;
  private lndClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  private shutdown: Function;
  private logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: GrpcComponents) {
    this.orderBook = components.orderBook;
    this.lndClient = components.lndClient;
    this.raidenClient = components.raidenClient;
    this.pool = components.pool;
    this.shutdown = components.shutdown;

    this.logger = Logger.rpc;
  }

  /**
   * Placeholder for a method to return general information about an Exchange Union node.
   */
  public getInfo = async (_call, callback) => {
    try {
      const lnd = await this.lndClient.getInfo();
      callback(null, { lnd });
    } catch (err) {
      this.logger.error(err);
      callback(err);
    }
  }

  /**
   * Get the list of the orderbook's available pairs.
   * @returns A list of available trading pairs
   */
  public getPairs = async (_call, callback) => {
    callback(null, this.orderBook.getPairs());
    try {
      callback(null, await this.orderBook.getPairs());
    } catch (err) {
      this.logger.error(err);
      callback(err);
    }
  }

  /**
   * Get a list of standing orders from the orderbook.
   */
  public getOrders = async (call, callback) => {
    let maxResults = call.request.maxResults;

    if (maxResults === undefined) {
      maxResults = 100;
    } else if (maxResults === 0) {
      // Return all orders
      maxResults = undefined;
    }

    try {
      callback(null, this.orderBook.getOrders(call.request.pairId, maxResults));
    } catch (err) {
      this.logger.error(err);
      callback(err);
    }
  }

  /**
   * Add an order to the orderbook.
   */
  public placeOrder = async (call, callback) => {
    const order = call.request;
    assert(typeof order.price === 'number', 'price name must be a number');
    assert(order.price > 0, 'price must be greater than 0');
    assert(typeof order.quantity === 'number', 'quantity must be a number');
    assert(order.quantity !== 0, 'quantity must not equal 0');
    assert(typeof order.pairId === 'string', 'pairId name must be a string');

    return this.orderBook.addLimitOrder(order);
  }

  /**
   * Connect to an XU node on a given host and port.
   */
  public connect = async (call, callback) => {
    const { host, port } = call.request;
    try {
      const peer = await this.pool.addOutbound(host, port);
      callback(null, peer.statusString);
    } catch (err) {
      callback(err);
    }
  }

  /**
   * Demo method to execute a Raiden Token Swap through XUD.
  */
  public tokenSwap = async (call, callback) => {
    const { target_address, payload, identifier } = call.request;
    try {
      callback(null, await this.raidenClient.tokenSwap(target_address, payload, identifier));
    } catch (err) {
      callback(err);
    }
  }
}

export default GrpcService;
