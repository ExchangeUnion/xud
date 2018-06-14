import assert from 'assert';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';

/**
 * The components required by the API service layer.
 */
export type ServiceComponents = {
  orderBook: OrderBook;
  lndClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  /** The function to be called to shutdown the parent process */
  shutdown: Function;
};

/** Class containing the available RPC methods for XUD */
class Service {
  private orderBook: OrderBook;
  private lndClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  public shutdown: Function;
  private logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: ServiceComponents) {
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
  public getInfo = async () => {
    const lnd = await this.lndClient.getInfo();
    return { lnd };
  }

  /**
   * Get the list of the orderbook's available pairs.
   * @returns A list of available trading pairs
   */
  public getPairs = () => {
    return this.orderBook.getPairs();
  }

  /**
   * Get a list of standing orders from the orderbook.
   */
  public getOrders = ({ pairId, maxResults }: { pairId: string, maxResults: number }) => {
    return this.orderBook.getOrders(pairId, maxResults);
  }

  /**
   * Add an order to the orderbook.
   */
  public placeOrder = async (order: OwnOrder) => {
    assert(order.price > 0, 'price must be greater than 0');
    assert(order.quantity !== 0, 'quantity must not equal 0');
    return this.orderBook.addLimitOrder(order);
  }

  /**
   * Connect to an XU node on a given host and port.
   */
  public connect = async ({ host, port }: { host: string, port: number }) => {
    const peer = await this.pool.addOutbound(host, port);
    return peer.getStatus();
  }

  /**
   * Demo method to execute a Raiden Token Swap through XUD.
  */
  public tokenSwap = async ({ target_address, payload, identifier }: { target_address: string, payload: TokenSwapPayload, identifier: string }) => {
    return this.raidenClient.tokenSwap(target_address, payload, identifier);
  }
}

export default Service;
