import assert from 'assert';
import { GrpcComponents } from './GrpcServer';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook, { Order } from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';

/** Class containing the available RPC methods for Exchange Union */
class GrpcService implements GrpcComponents {
  orderBook: OrderBook;
  lndClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  shutdown: Function;
  logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: GrpcComponents) {
    this.orderBook = components.orderBook;
    this.lndClient = components.lndClient;
    this.raidenClient = components.raidenClient;
    this.pool = components.pool;
    this.shutdown = components.shutdown;
    this.logger = Logger.global;
    this.getInfo = this.getInfo.bind(this);
    this.getPairs = this.getPairs.bind(this);
    this.getOrders = this.getOrders.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
    this.connect = this.connect.bind(this);
    this.tokenSwap = this.tokenSwap.bind(this);
    this.shutdown = this.shutdown.bind(this);
  }

  /**
   * Placeholder for a method to return general information about an Exchange Union node.
   */
  getInfo(_call, callback) {
    callback(null, this.lndClient.getInfo());
  }

  /**
   * Get the list of the orderbook's available pairs.
   * @returns A list of available trading pairs
   */
  getPairs(_call, callback) {
    callback(null, this.orderBook.getPairs());
  }

  /**
   * Get a list of standing orders from the orderbook.
   */
  getOrders(_call, callback) {
    callback(null, this.orderBook.getOrders());
  }

  /**
   * Add an order to the orderbook.
   */
  async placeOrder(call, callback) {
    const order = call.request;
    assert(typeof order.price === 'number', 'price name must be a number');
    assert(order.price > 0, 'price must be greater than 0');
    assert(typeof order.quantity === 'number', 'quantity must be a number');
    assert(order.quantity !== 0, 'quantity must not equal 0');
    assert(typeof order.pair_id === 'string', 'pairId name must be a string');
    if (!this.lndClient.isDisabled()) {
      // temporary simple invoices until swaps are operational
      const invoice = await this.lndClient.addInvoice(order.price * order.quantity);
      order.invoice = invoice.paymentRequest;
    }
    callback(null, this.orderBook.addOrder(order));
  }

  /**
   * Connect to an XU node on a given host and port.
   */
  async connect(call, callback) {
    const { host, port } = call.request;
    const peer = await this.pool.addOutbound(host, port);
    callback(null, peer.statusString);
  }

  /**
   * Demo method to execute a Raiden Token Swap through XUD.
  */
  tokenSwap(call, callback) {
    const { target_address, payload, identifier } = call.request;
    callback(null, this.raidenClient.tokenSwap(target_address, payload, identifier));
  }
}

export default GrpcService;
