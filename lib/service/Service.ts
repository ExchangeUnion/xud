import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient, { LndInfo } from '../lndclient/LndClient';
import RaidenClient, { RaidenInfo } from '../raidenclient/RaidenClient';
import { EventEmitter } from 'events';
import errors from './errors';
import { SwapDealRole, SwapClients } from '../types/enums';
import { parseUri, getUri, UriParts } from '../utils/utils';
import * as lndrpc from '../proto/lndrpc_pb';
import { Pair, StampedOrder } from '../types/orders';
import Swaps from '../swaps/Swaps';
import { OrderSidesArrays } from '../orderbook/MatchingEngine';

/**
 * The components required by the API service layer.
 */
type ServiceComponents = {
  orderBook: OrderBook;
  lndBtcClient: LndClient;
  lndLtcClient: LndClient;
  raidenClient: RaidenClient;
  pool: Pool;
  /** The version of the local xud instance. */
  version: string;
  swaps: Swaps;
  /** The function to be called to shutdown the parent process */
  shutdown: () => void;
};

type XudInfo = {
  version: string;
  nodePubKey: string;
  uris: string[];
  numPeers: number;
  numPairs: number;
  orders: { peer: number, own: number};
  lndbtc?: LndInfo;
  lndltc?: LndInfo;
  raiden?: RaidenInfo;
};

/** Functions to check argument validity and throw [[INVALID_ARGUMENT]] when invalid. */
const argChecks = {
  HAS_HOST: ({ host }: { host: string }) => { if (host === '') throw errors.INVALID_ARGUMENT('host must be specified'); },
  HAS_ORDER_ID: ({ orderId }: { orderId: string }) => { if (orderId === '') throw errors.INVALID_ARGUMENT('orderId must be specified'); },
  HAS_NODE_PUB_KEY: ({ nodePubKey }: { nodePubKey: string }) => {
    if (nodePubKey === '') throw errors.INVALID_ARGUMENT('nodePubKey must be specified');
  },
  HAS_PAIR_ID: ({ pairId }: { pairId: string }) => { if (pairId === '') throw errors.INVALID_ARGUMENT('pairId must be specified'); },
  NON_ZERO_QUANTITY: ({ quantity }: { quantity: number }) => { if (quantity === 0) throw errors.INVALID_ARGUMENT('quantity must not equal 0'); },
  PRICE_NON_NEGATIVE: ({ price }: { price: number }) => { if (price < 0) throw errors.INVALID_ARGUMENT('price cannot be negative'); },
  VALID_CURRENCY: ({ currency }: { currency: string }) => {
    if (currency.length < 2 || currency.length > 5 || !currency.match(/^[A-Z0-9]+$/))  {
      throw errors.INVALID_ARGUMENT('currency must consist of 2 to 5 upper case English letters or numbers');
    }
  },
  VALID_PORT: ({ port }: { port: number }) => {
    if (port < 1024 || port > 65535 || !Number.isInteger(port)) throw errors.INVALID_ARGUMENT('port must be an integer between 1024 and 65535');
  },
  VALID_SWAP_CLIENT: ({ swapClient }: { swapClient: number }) => {
    if (!SwapClients[swapClient]) throw errors.INVALID_ARGUMENT('swap client is not recognized');
  },
};

/** Class containing the available RPC methods for XUD */
class Service extends EventEmitter {
  public shutdown: () => void;
  private orderBook: OrderBook;
  private lndBtcClient: LndClient;
  private lndLtcClient: LndClient;
  private raidenClient: RaidenClient;
  private pool: Pool;
  private version: string;
  private swaps: Swaps;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(private logger: Logger, components: ServiceComponents) {
    super();

    this.shutdown = components.shutdown;
    this.orderBook = components.orderBook;
    this.lndBtcClient = components.lndBtcClient;
    this.lndLtcClient = components.lndLtcClient;
    this.raidenClient = components.raidenClient;
    this.pool = components.pool;
    this.swaps = components.swaps;

    this.version = components.version;
  }

  /** Adds a currency. */
  public addCurrency = async (args: { currency: string, swapClient: SwapClients | number, decimalPlaces: number, tokenAddress?: string}) => {
    argChecks.VALID_CURRENCY(args);
    argChecks.VALID_SWAP_CLIENT(args);
    const { currency, swapClient, tokenAddress, decimalPlaces } = args;

    await this.orderBook.addCurrency({
      tokenAddress,
      swapClient,
      decimalPlaces,
      id: currency,
    });
  }

  /** Adds a trading pair. */
  public addPair = async (args: { baseCurrency: string, quoteCurrency: string }) => {
    await this.orderBook.addPair(args);
  }

  /*
   * Cancel placed order from the orderbook.
   */
  public cancelOrder = async (args: { orderId: string }) => {
    const { orderId } = args;
    argChecks.HAS_ORDER_ID(args);

    this.orderBook.removeOwnOrderByLocalId(orderId);
  }

  /** Gets the total lightning network channel balance for a given currency. */
  public channelBalance = (args: { currency: string }) => {
    const { currency } = args;

    let cmdLnd: LndClient;
    switch (currency.toUpperCase()) {
      case 'BTC':
        cmdLnd = this.lndBtcClient;
        break;
      case 'LTC':
        cmdLnd = this.lndLtcClient;
        break;
      default:
        // TODO: throw an error here indicating that lnd is disabled for this currency
        return { balance: 0, pendingOpenBalance: 0 };
    }

    return cmdLnd.channelBalance();
  }

  /**
   * Connect to an XU node on a given node uri.
   */
  public connect = async (args: { nodeUri: string }) => {
    let uriParts: UriParts;
    try {
      uriParts = parseUri(args.nodeUri);
    } catch (err) {
      throw errors.INVALID_ARGUMENT('uri is invalid');
    }
    const { nodePubKey, host, port } = uriParts;
    argChecks.HAS_NODE_PUB_KEY({ nodePubKey });
    argChecks.HAS_HOST({ host });
    argChecks.VALID_PORT({ port });

    await this.pool.addOutbound({ host, port }, nodePubKey, false);
  }

  /*
   * Disconnect from a connected peer XU node on a given host and port.
   */
  public disconnect = async (args: { nodePubKey: string }) => {
    const { nodePubKey } = args;
    argChecks.HAS_NODE_PUB_KEY(args);
    await this.pool.closePeer(nodePubKey);
  }

  /**
   * Get general information about this Exchange Union node.
   */
  public getInfo = async (): Promise<XudInfo> => {
    const { nodePubKey, addresses } = this.pool.handshakeData;

    const uris: string[] = [];

    if (addresses && addresses.length > 0) {
      addresses.forEach((address) => {
        uris.push(getUri({ nodePubKey, host: address.host, port: address.port }));
      });
    }

    let peerOrdersCount = 0;
    let ownOrdersCount = 0;
    let numPairs = 0;
    for (const pairId of this.orderBook.pairIds) {
      const peerOrders = this.orderBook.getPeerOrders(pairId);
      const ownOrders = this.orderBook.getOwnOrders(pairId);

      peerOrdersCount += Object.keys(peerOrders.buy).length + Object.keys(peerOrders.sell).length;
      ownOrdersCount += Object.keys(ownOrders.buy).length + Object.keys(ownOrders.sell).length;
      numPairs += 1;
    }

    const lndbtc = this.lndBtcClient.isDisabled() ? undefined : await this.lndBtcClient.getLndInfo();
    const lndltc = this.lndLtcClient.isDisabled() ? undefined : await this.lndLtcClient.getLndInfo();

    const raiden = this.raidenClient.isDisabled() ? undefined : await this.raidenClient.getRaidenInfo();

    return {
      lndbtc,
      lndltc,
      raiden,
      nodePubKey,
      uris,
      numPairs,
      version: this.version,
      numPeers: this.pool.peerCount,
      orders: {
        peer: peerOrdersCount,
        own: ownOrdersCount,
      },
    };
  }

  /**
   * Get a map between pair ids and its orders from the order book.
   */
  public getOrders = (args: { pairId: string, includeOwnOrders: boolean }): Map<string, OrderSidesArrays<any>> => {
    const { pairId, includeOwnOrders } = args;

    const result = new Map<string, OrderSidesArrays<any>>();
    const getOrderTypes = (pairId: string) => {
      const orders = this.orderBook.getPeerOrders(pairId);

      if (includeOwnOrders) {
        const ownOrders: OrderSidesArrays<any> = this.orderBook.getOwnOrders(pairId);

        orders.buy = [...orders.buy, ...ownOrders.buy];
        orders.sell = [...orders.sell, ...ownOrders.sell];
      }

      return orders;
    };

    if (pairId) {
      result.set(pairId, getOrderTypes(pairId));
    } else {
      Array.from(this.orderBook.pairIds).forEach((pairId) => {
        result.set(pairId, getOrderTypes(pairId));
      });
    }

    return result;
  }

  /**
   * Get the list of the order book's supported currencies
   * @returns A list of supported currency ticker symbols
   */
  public listCurrencies = () => {
    const pairs = new Map<string, Pair>();
    return Array.from(this.orderBook.currencies.keys());
  }

  /**
   * Get the list of the order book's supported pairs.
   * @returns A list of supported trading pair tickers
   */
  public listPairs = () => {
    return Array.from(this.orderBook.pairIds);
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
  public placeOrder = async (args: { pairId: string, price: number, quantity: number, orderId: string }) => {
    const { pairId, price, quantity, orderId } = args;
    argChecks.PRICE_NON_NEGATIVE(args);
    argChecks.NON_ZERO_QUANTITY(args);
    argChecks.HAS_PAIR_ID(args);

    const order = {
      pairId,
      price,
      quantity,
      localId: orderId,
    };

    return price > 0 ? this.orderBook.addLimitOrder(order) : this.orderBook.addMarketOrder(order);
  }

  /** Removes a currency. */
  public removeCurrency = async (args: { currency: string }) => {
    argChecks.VALID_CURRENCY(args);
    const { currency } = args;

    await this.orderBook.removeCurrency(currency);
  }

  /** Removes a trading pair. */
  public removePair = async (args: { pairId: string }) => {
    argChecks.HAS_PAIR_ID(args);
    const { pairId } = args;

    return this.orderBook.removePair(pairId);
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

  /**
   * resolveHash resolve hash to preimage.
   */
  public resolveHash = async (args: { hash: string }) => {
    return this.swaps.resolveHash(args);
  }
}
export default Service;
export { ServiceComponents };
