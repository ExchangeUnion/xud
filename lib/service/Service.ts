import assert from 'assert';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';
import Config from '../Config';

const packageJson = require('../../package.json');

/**
 * The components required by the API service layer.
 */
export type ServiceComponents = {
  orderBook: OrderBook;
  lndClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  config: Config
  /** The function to be called to shutdown the parent process */
  shutdown: Function;
};

/** Class containing the available RPC methods for XUD */
class Service {
  public shutdown: Function;

  private orderBook: OrderBook;
  private lndClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  private config: Config;
  private logger: Logger;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: ServiceComponents) {
    this.shutdown = components.shutdown;

    this.orderBook = components.orderBook;
    this.lndClient = components.lndClient;
    this.raidenClient = components.raidenClient;
    this.pool = components.pool;
    this.config = components.config;

    this.logger = Logger.rpc;
  }

  /**
   * Get general information about this Exchange Union node.
   */
  public getInfo = async () => {
    const info: any = {};

    info.version = packageJson.version;

    const pairs = await this.orderBook.getPairs();
    info.numPeers = this.pool.peerCount;
    info.numPairs = pairs.length;

    let peerOrdersCount: number = 0;
    let ownOrdersCount: number = 0;
    for (const key in pairs) {
      const pair = pairs[key];

      const [orders, ownOrders] = await Promise.all([
        this.orderBook.getPeerOrders(pair.id, 0),
        this.orderBook.getOwnOrders(pair.id, 0),
      ]);

      peerOrdersCount += orders.buyOrders.length + orders.sellOrders.length;
      ownOrdersCount += ownOrders.buyOrders.length + ownOrders.sellOrders.length;
    }

    info.orders = {
      peer: peerOrdersCount,
      own: ownOrdersCount,
    };

    if (!this.config.lnd.disable) {
      try {
        const lnd = await this.lndClient.getInfo();

        info.lnd = {
          channels: {
            active: lnd.numActiveChannels,
            pending: lnd.numPendingChannels,
          },
          chains: lnd.chainsList,
          blockheight: lnd.blockHeight,
          uris: lnd.urisList,
          version: lnd.version,
        };

      } catch (err) {
        this.logger.error(`LND error: ${err}`);
        info.lnd = {
          error: String(err),
        };
      }
    }

    if (!this.config.raiden.disable) {
      try {
        const [address, channels] = await Promise.all([
          this.raidenClient.getAddress(),
          this.raidenClient.getChannels(),
        ]);

        info.raiden = {
          address,
          channels: channels.length,
          // Hardcoded for now until they expose it to their API
          version: 'v0.3.0',
        };

      } catch (err) {
        info.raiden = {
          error: String(err),
        };
      }

    }

    return info;
  }

  /**
   * Get the list of the order book's available pairs.
   * @returns A list of available trading pairs
   */
  public getPairs = () => {
    return this.orderBook.getPairs();
  }

  /**
   * Get a list of standing orders from the order book.
   */
  public getOrders = ({ pairId, maxResults }: { pairId: string, maxResults: number }) => {
    return this.orderBook.getPeerOrders(pairId, maxResults);
  }

  /**
   * Add an order to the order book.
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

  /**
   * Execute a Swap.
   */
  public executeSwap = async() => {

  }

  /**
   * Subcribe to Incoming Peer Orders.
   */
  public subscribePeerOrders = async() => {

  }

  /**
   * Subcribe to  Swap Executions.
   */
  public subscribeSwaps = async() => {

  }

}
export default Service;
