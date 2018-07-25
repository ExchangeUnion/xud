import assert from 'assert';
import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';
import Config from '../Config';
import { EventEmitter } from 'events';
import { orders } from '../types';
import SocketAddress from '../p2p/SocketAddress';
import { ServiceError, status } from 'grpc';

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
class Service extends EventEmitter {
  public shutdown: Function;

  private orderBook: OrderBook;
  private lndClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  private config: Config;
  private logger: Logger;

    /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: ServiceComponents) {
    super();

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
     * @throws ServiceError with status.FAILED_PRECONDITION if order constructon fails
     */
  public getInfo = async () => {
    const info: any = {};

    info.version = packageJson.version;
    await this.constructOders(info);

    if (!this.config.lnd.disable) {
      info.lnd = await this.connectToLnd();
    }

    if (!this.config.raiden.disable) {
      info.raiden = await this.connectToRaiden();
    }

    return info;
  }

    /**
     * Get the list of the order book's available pairs.
     * @returns A list of available trading pairs
     * @throws ServiceError with status.FAILED_PRECONDITION code
     */
  public getPairs = () => {
    try {
      return this.orderBook.getPairs();
    } catch (err) {
      const serviceError: ServiceError = {
        code: status.FAILED_PRECONDITION,
        metadata: err,
        name: 'db',
        message: 'could not get pairs',
      };
      throw serviceError;
    }
  }

    /**
     * Get a list of standing orders from the order book.
     * @throws ServiceError with status.INTERNAL code
     */
  public getOrders = ({ pairId, maxResults }: { pairId: string, maxResults: number }) => {
    try {
      return this.orderBook.getPeerOrders(pairId, maxResults);
    }catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        metadata: err,
        name: 'internal',
        message: 'could not get orders',
      };
      throw serviceError;
    }
  }

    /**
     * Add an order to the order book.
     * @throws ServiceError with status.INTERNAL code
     */
  public placeOrder = async (order: OwnOrder) => {
    if (order.price < 0) {
      const serviceError: ServiceError = {
        code: status.INVALID_ARGUMENT,
        name: 'invalidArgument',
        message: 'price cannot be negative',
      };
      throw serviceError;
    }

    if (order.quantity === 0) {
      const serviceError: ServiceError = {
        code: status.INVALID_ARGUMENT,
        name: 'invalid argument',
        message: 'quantity must not equal 0',
      };
      throw serviceError;
    }

    try {
      if (order.price === 0) {
        return this.orderBook.addMarketOrder(order);
      } else {
        return this.orderBook.addLimitOrder(order);
      }
    }catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        name: 'internal',
        message: 'internal error occured while placing order',
        metadata: err,
      };
      throw serviceError;
    }
  }

    /*
     * Cancel placed order from the orderbook.
     */
  public cancelOrder = async (_id: string) => {
    return 'Not implemented';
  }

    /**
     * Connect to an XU node on a given host and port.
     * @throws ServiceError with status.INTERNAL code
     */
  public connect = async ({ host, port }: { host: string, port: number }) => {
    try {
      const peer = await this.pool.addOutbound(new SocketAddress(host, port));
      return peer.getStatus();
    } catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        name: 'internal',
        message: 'internal error occured while connecting',
        metadata: err,
      };
      throw serviceError;
    }
  }

    /*
     * Disconnect from a connected peer XU node on a given host and port.
     * @throws ServiceError with status.INTERNAL code
     */
  public disconnect = async ({ host, port }: { host: string, port: number }) => {
    try {
      await this.pool.disconnectPeer(host, port);
      return 'success';
    } catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        name: 'internal',
        message: 'internal error occured while disconnecting',
        metadata: err,
      };
      throw serviceError;
    }
  }

    /**
     * Execute an atomic swap
     * @throws ServiceError with status.INTERNAL code
     */
  public executeSwap = async ({ target_address, payload, identifier }: { target_address: string, payload: TokenSwapPayload, identifier: string }) => {
    try {
      return this.raidenClient.tokenSwap(target_address, payload, identifier);
    } catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        name: 'internal',
        message: 'internal error occured while executing swap',
        metadata: err,
      };
      throw serviceError;
    }
  }

    /*
     * Subscribe to incoming peer orders.
     * @throws ServiceError with status.INTERNAL code
     */
  public subscribePeerOrders = async (callback: Function) => {
    try {
      this.orderBook.on('peerOrder', order => callback(order));
    }catch (err) {
      const serviceError: ServiceError = {
        code: status.INTERNAL,
        name: 'internal',
        message: 'internal error occured while subscribing peer orders',
        metadata: err,
      };
      throw serviceError;
    }
  }

    /*
     * Subscribe to executed swaps
     */
  public subscribeSwaps = async (_callback: Function) => {
  }

    /*
     * Differently from LND and RAIDEN connections this function is a must for
     * getInfo, so it catches possible errors and converts them into meaningful ServiceError
     * then throws it to prevent startup
     *
     * No logging is required since exception to be thrown will be catched and logged at upstream
     */
  private constructOders = async(info: any) => {
    try {
      const pairs = await this.orderBook.getPairs();
      info.numPeers = this.pool.peerCount;
      info.numPairs = pairs.length;

      let peerOrdersCount: number = 0;
      let ownOrdersCount: number = 0;
      for (const key in pairs) {
        const pair = pairs[key];

        const [peerOrders, ownOrders] = await Promise.all([
          this.orderBook.getPeerOrders(pair.id, 0),
          this.orderBook.getOwnOrders(pair.id, 0),
        ]);

        peerOrdersCount += Object.keys(peerOrders.buyOrders).length + Object.keys(peerOrders.sellOrders).length;
        ownOrdersCount += Object.keys(ownOrders.buyOrders).length + Object.keys(ownOrders.sellOrders).length;
      }

      info.orders = {
        peer: peerOrdersCount,
        own: ownOrdersCount,
      };
    } catch (err) {
      const serviceError: ServiceError = {
        code: status.FAILED_PRECONDITION,
        metadata: err,
        name: 'order constructon',
        message: 'could not construct orders',
      };
      throw serviceError;
    }
  }

  private connectToRaiden = async() => {
    try {
      const [address, channels] = await Promise.all([
        this.raidenClient.getAddress(),
        this.raidenClient.getChannels(),
      ]);

      return {
        address,
        channels: channels.length,
                // Hardcoded for now until they expose it to their API
        version: 'v0.3.0',
      };

    } catch (err) {
      const serviceError: ServiceError = {
        code: status.FAILED_PRECONDITION,
        metadata: err,
        name: 'raiden',
        message: 'could not connect to raiden',
      };
      this.logger.error(`raiden error: ${serviceError}`);
      return {
        error: serviceError,
      };
    }
  }

  private connectToLnd = async() => {
    try {
      const lnd = await this.lndClient.getInfo();

      return {
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
      const serviceError: ServiceError = { code: status.FAILED_PRECONDITION, metadata: err, name: 'lnd', message: 'could not connect to LND' };
      this.logger.error(`lnd error: ${serviceError}`);
      return {
        error: serviceError,
      };
    }
  }
}

export default Service;
