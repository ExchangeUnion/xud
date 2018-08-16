import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';
import Config from '../Config';
import { EventEmitter } from 'events';
import errors from './errors';
import lndErrors from '../lndclient/errors';
import { Address } from '../types/p2p';

/**
 * The components required by the API service layer.
 */
export type ServiceComponents = {
  orderBook: OrderBook;
  lndBtcClient: LndClient;
  lndLtcClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  config: Config
  /** The function to be called to shutdown the parent process */
  shutdown: Function;
  /** The version of the local xud instance. */
  version: string;
};

/** Functions to check argument validity and throw [[INVALID_ARGUMENT]] when invalid. */
const argChecks = {
  HAS_HOST: ({ host }: { host: string }) => { if (host === '') throw errors.INVALID_ARGUMENT('host must be specified'); },
  HAS_ORDER_ID: ({ orderId }: { orderId: string }) => { if (orderId === '') throw errors.INVALID_ARGUMENT('orderId must be specified'); },
  HAS_NODE_PUB_KEY: ({ nodePubKey }: { nodePubKey: string }) => {
    if (nodePubKey === '') throw errors.INVALID_ARGUMENT('nodePubKey must be specified');
  },
  HAS_PAIR_ID: ({ pairId }: { pairId: string }) => { if (pairId === '') throw errors.INVALID_ARGUMENT('pairId must be specified'); },
  MAX_RESULTS_NOT_NEGATIVE: ({ maxResults }: { maxResults: number }) => {
    if (maxResults < 0) throw errors.INVALID_ARGUMENT('maxResults cannot be negative');
  },
  NON_ZERO_QUANTITY: ({ quantity }: { quantity: number }) => { if (quantity === 0) throw errors.INVALID_ARGUMENT('quantity must not equal 0'); },
  PRICE_NON_NEGATIVE: ({ price }: { price: number }) => { if (price < 0) throw errors.INVALID_ARGUMENT('price cannot be negative'); },
  VALID_PORT: ({ port }: { port: number }) => {
    if (port < 1024 || port > 65535 || !Number.isInteger(port)) throw errors.INVALID_ARGUMENT('port must be an integer between 1024 and 65535');
  },
};

/** Class containing the available RPC methods for XUD */
class Service extends EventEmitter {
  public shutdown: Function;
  private orderBook: OrderBook;
  private lndBtcClient: LndClient;
  private lndLtcClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  private config: Config;
  private version: string;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(private logger: Logger, components: ServiceComponents) {
    super();

    this.shutdown = components.shutdown;
    this.orderBook = components.orderBook;
    this.lndBtcClient = components.lndBtcClient;
    this.lndLtcClient = components.lndLtcClient;
    this.raidenClient = components.raidenClient;
    this.pool = components.pool;
    this.config = components.config;

    this.version = components.version;
  }

  private getLndInfo = async (lndClient: LndClient)  => {
    let info: any = {};

    if (lndClient.isDisabled()) {
      info = {
        error: String(lndErrors.LND_IS_DISABLED.message),
      };
      return info;
    }
    if (!lndClient.isConnected()) {
      this.logger.error(`LND error: ${lndErrors.LND_IS_DISCONNECTED.message}`);
      info = {
        error: String(lndErrors.LND_IS_DISCONNECTED.message),
      };
      return info;
    }

    try {
      const lnd = await lndClient.getInfo();

      info = {
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
      info = {
        error: String(err),
      };
    }
    return info;
  }

  /*
   * Cancel placed order from the orderbook.
   */
  public cancelOrder = async (args: { orderId: string, pairId: string }) => {
    const { orderId, pairId } = args;
    argChecks.HAS_ORDER_ID(args);
    argChecks.HAS_PAIR_ID(args);

    const { removed, globalId } = this.orderBook.removeOwnOrderByLocalId(pairId, orderId);

    if (removed) {
      this.pool.broadcastOrderInvalidation({
        pairId,
        orderId: globalId!,
      });
    }
    return { canceled: removed };
  }

  /**
   * Connect to an XU node on a given host and port.
   */
  public connect = async (args: Address & { nodePubKey: string }) => {
    const { host, port, nodePubKey } = args;
    argChecks.HAS_NODE_PUB_KEY(args);
    argChecks.HAS_HOST(args);
    argChecks.VALID_PORT(args);
    const peer = await this.pool.addOutbound({ host, port }, nodePubKey);
    return peer.getStatus();
  }

  /*
   * Disconnect from a connected peer XU node on a given host and port.
   */
  public disconnect = async (args: { nodePubKey: string }) => {
    const { nodePubKey } = args;
    argChecks.HAS_NODE_PUB_KEY(args);
    await this.pool.closePeer(nodePubKey);
    return 'success';
  }

  /**
   * Execute an atomic swap
   */
  public executeSwap = async ({ target_address, payload }: { target_address: string, payload: TokenSwapPayload }) => {
    return this.raidenClient.tokenSwap(target_address, payload);
  }

  /**
   * Get general information about this Exchange Union node.
   */
  public getInfo = async () => {
    const info: any = {};

    info.version = this.version;

    const pairIds = this.orderBook.pairIds;
    info.numPeers = this.pool.peerCount;
    info.numPairs = pairIds.length;

    let peerOrdersCount = 0;
    let ownOrdersCount = 0;
    pairIds.forEach((pairId) => {
      const peerOrders = this.orderBook.getPeerOrders(pairId, 0);
      const ownOrders = this.orderBook.getOwnOrders(pairId, 0);

      peerOrdersCount += Object.keys(peerOrders.buyOrders).length + Object.keys(peerOrders.sellOrders).length;
      ownOrdersCount += Object.keys(ownOrders.buyOrders).length + Object.keys(ownOrders.sellOrders).length;
    });

    info.orders = {
      peer: peerOrdersCount,
      own: ownOrdersCount,
    };

    info.lndbtc = await this.getLndInfo(this.lndBtcClient);
    info.lndltc = await this.getLndInfo(this.lndLtcClient);
    if (!this.config.raiden.disable) {
      try {
        const channels = await this.raidenClient.getChannels();

        info.raiden = {
          address: this.raidenClient.address!,
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
   * Get a list of standing orders from the order book for a specified trading pair.
   */
  public getOrders = (args: { pairId: string, maxResults: number }) => {
    const { pairId, maxResults } = args;
    argChecks.HAS_PAIR_ID(args);
    argChecks.MAX_RESULTS_NOT_NEGATIVE(args);

    const result = {
      peerOrders: this.orderBook.getPeerOrders(pairId, maxResults),
      ownOrders: this.orderBook.getOwnOrders(pairId, maxResults),
    };

    return result;
  }

  /**
   * Get the list of the order book's available pairs.
   * @returns A list of available trading pairs
   */
  public getPairs = () => {
    return this.orderBook.pairs;
  }

  /**
   * Get information about currently connected peers.
   * @returns A list of connected peers with key information for each peer
   */
  public listPeers = () => {
    return this.pool.listPeers();
  }

  /**
   * Add an order to the order book.
   * If price is zero or unspecified a market order will get added.
   */
  public placeOrder = async (order: OwnOrder) => {
    argChecks.PRICE_NON_NEGATIVE(order);
    argChecks.NON_ZERO_QUANTITY(order);
    argChecks.HAS_PAIR_ID(order);

    return order.price > 0 ? this.orderBook.addLimitOrder(order) : this.orderBook.addMarketOrder(order);
  }

  /*
   * Subscribe to incoming peer orders.
   */
  public subscribePeerOrders = async (callback: Function) => {
    this.orderBook.on('peerOrder.incoming', order => callback(order));
    this.orderBook.on('peerOrder.invalidation', order => callback({
      canceled: true,
      id: order.orderId,
      pairId: order.pairId,
      quantity: order.quantity,
    }));
  }

  /*
   * Subscribe to executed swaps
   */
  public subscribeSwaps = async (_callback: Function) => {};
}

export default Service;
