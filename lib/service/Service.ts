import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient, { LndInfo } from '../lndclient/LndClient';
import RaidenClient, { RaidenInfo } from '../raidenclient/RaidenClient';
import { EventEmitter } from 'events';
import errors from './errors';
import { SwapClients, OrderSide, SwapRole } from '../types/enums';
import { parseUri, getUri, UriParts } from '../utils/utils';
import * as lndrpc from '../proto/lndrpc_pb';
import { Pair, Order, OrderPortion, OwnOrder, PeerOrder } from '../types/orders';
import { PlaceOrderEvent } from '../types/orderBook';
import Swaps from '../swaps/Swaps';
import { OrderSidesArrays } from '../orderbook/TradingPair';
import { SwapResult } from 'lib/swaps/types';

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
   * Remove placed order from the orderbook.
   */
  public removeOrder = async (args: { orderId: string }) => {
    const { orderId } = args;
    argChecks.HAS_ORDER_ID(args);

    this.orderBook.removeOwnOrderByLocalId(orderId);
  }

  /** Gets the total lightning network channel balance for a given currency. */
  public channelBalance = async (args: { currency: string }) => {
    const { currency } = args;
    const balances = new Map<string, { balance: number, pendingOpenBalance: number }>();
    const getBalance = async (currency: string) => {
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

      const channelBalance = await cmdLnd.channelBalance();
      return channelBalance.toObject();
    };

    if (currency) {
      argChecks.VALID_CURRENCY(args);
      balances.set(currency, await getBalance(currency));
    } else {
      for (const currency of this.orderBook.currencies.keys()) {
        balances.set(currency, await getBalance(currency));
      }
    }

    return balances;
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
   * Ban a XU node manually and disconnect from it.
   */
  public ban = async (args: { nodePubKey: string}) => {
    argChecks.HAS_NODE_PUB_KEY(args);
    await this.pool.banNode(args.nodePubKey);
  }

  /*
   * Remove ban from XU node manually and connenct to it.
   */
  public unban = async (args: { nodePubKey: string, reconnect: boolean}) => {
    argChecks.HAS_NODE_PUB_KEY(args);
    await this.pool.unban(args);
  }

  public executeSwap = async (args: { orderId: string, pairId: string, peerPubKey: string, quantity: number }): Promise<SwapResult> => {
    if (!this.orderBook.nomatching) {
      throw errors.NOMATCHING_MODE_IS_REQUIRED();
    }

    const { orderId, pairId, peerPubKey } = args;
    const quantity = args.quantity > 0 ? args.quantity : undefined; // passing 0 quantity will work fine, but it's prone to bugs

    const maker = this.orderBook.removePeerOrder(orderId, pairId, peerPubKey, quantity).order;
    const taker = this.orderBook.stampOwnOrder({
      pairId,
      localId: '',
      price: maker.price,
      isBuy: !maker.isBuy,
      quantity: quantity || maker.quantity,
      hold: 0,
    });

    return this.orderBook.executeSwap(maker, taker);
  }

  /**
   * Gets information about a specified node.
   */
  public getNodeInfo = async (args: { nodePubKey: string }) => {
    argChecks.HAS_NODE_PUB_KEY(args);
    const info = await this.pool.getNodeReputation(args.nodePubKey);
    return info;
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
      const peerOrders = this.orderBook.getPeersOrders(pairId);
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
      const orders = this.orderBook.getPeersOrders(pairId);

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
      this.orderBook.pairIds.forEach((pairId) => {
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
    return this.orderBook.pairIds;
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
  public placeOrder = async (
    args: { pairId: string, price: number, quantity: number, orderId: string, side: number },
    callback?: (e: PlaceOrderEvent) => void,
  ) => {
    const { pairId, price, quantity, orderId, side } = args;
    argChecks.PRICE_NON_NEGATIVE(args);
    argChecks.NON_ZERO_QUANTITY(args);
    argChecks.HAS_PAIR_ID(args);

    const order = {
      pairId,
      price,
      quantity,
      isBuy: side === OrderSide.Buy,
      localId: orderId,
      hold: 0,
    };

    return price > 0 ? await this.orderBook.placeLimitOrder(order, callback) : await this.orderBook.placeMarketOrder(order, callback);
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
   * Subscribe to orders being added to the order book.
   */
  public subscribeAddedOrders = (args: { existing: boolean, all: boolean }, callback: (order: Order) => void) => {
    if (args.existing) {
      this.orderBook.pairIds.forEach((pair) => {
        const { buy: ownOrdersBuy, sell: ownOrdersSell } = this.orderBook.getOwnOrders(pair);
        const { buy : peerOrdersBuy, sell : peerOrdersSell } = this.orderBook.getPeersOrders(pair);

        if (args.all) {
          ownOrdersBuy.forEach(callback);
          peerOrdersBuy.forEach(callback);
          ownOrdersSell.forEach(callback);
          peerOrdersSell.forEach(callback);
        } else {
          ownOrdersBuy.slice(0, 10).forEach(callback);
          peerOrdersBuy.slice(0, 10).forEach(callback);
          ownOrdersSell.slice(0, 10).forEach(callback);
          peerOrdersSell.slice(0, 10).forEach(callback);
        }
      });
    }

    this.orderBook.on('peerOrder.incoming', callback);
    this.orderBook.on('ownOrder.added', callback);
  }

  /**
   * Subscribe to orders being removed from the order book.
   */
  public subscribeRemovedOrders = async (callback: (order: OrderPortion) => void) => {
    this.orderBook.on('peerOrder.invalidation', order => callback(order));
    this.orderBook.on('peerOrder.filled', order => callback(order));
    this.orderBook.on('ownOrder.filled', order => callback(order));
    this.orderBook.on('ownOrder.swapped', order => callback(order));
  }

  /*
   * Subscribe to completed swaps that are initiated by a remote peer.
   */
  public subscribeSwaps = async (callback: (swapResult: SwapResult) => void) => {
    // TODO: use `ownOrder.swapped` order book event instead
    this.swaps.on('swap.paid', (swapResult) => {
      if (swapResult.role === SwapRole.Maker) {
        // only alert client for maker matches, taker matches are handled via placeOrder
        callback(swapResult);
      }
    });
  }

  /**
   * resolveHash resolve hash to preimage.
   */
  public resolveHash = async (request: lndrpc.ResolveRequest) => {
    return this.swaps.resolveHash(request);
  }
}
export default Service;
export { ServiceComponents };
