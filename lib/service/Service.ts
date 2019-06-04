import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import { LndInfo } from '../lndclient/types';
import { RaidenInfo } from '../raidenclient/types';
import errors from './errors';
import { SwapClientType, OrderSide, SwapRole } from '../constants/enums';
import { parseUri, toUri, UriParts } from '../utils/uriUtils';
import { sortOrders } from '../utils/utils';
import { Order, OrderPortion, PlaceOrderEvent } from '../orderbook/types';
import Swaps from '../swaps/Swaps';
import SwapClientManager from '../swaps/SwapClientManager';
import { OrderSidesArrays } from '../orderbook/TradingPair';
import { SwapSuccess, SwapFailure, ResolveRequest } from '../swaps/types';
import { errors as swapsErrors } from '../swaps/errors';

/**
 * The components required by the API service layer.
 */
type ServiceComponents = {
  orderBook: OrderBook;
  swapClientManager: SwapClientManager;
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
  lnd: Map<string, LndInfo>;
  raiden?: RaidenInfo;
};

/** Functions to check argument validity and throw [[INVALID_ARGUMENT]] when invalid. */
const argChecks = {
  HAS_HOST: ({ host }: { host: string }) => { if (host === '') throw errors.INVALID_ARGUMENT('host must be specified'); },
  HAS_ORDER_ID: ({ orderId }: { orderId: string }) => { if (orderId === '') throw errors.INVALID_ARGUMENT('orderId must be specified'); },
  HAS_NODE_PUB_KEY: ({ nodePubKey }: { nodePubKey: string }) => {
    if (nodePubKey === '') throw errors.INVALID_ARGUMENT('nodePubKey must be specified');
  },
  HAS_PEER_PUB_KEY: ({ peerPubKey }: { peerPubKey: string }) => {
    if (peerPubKey === '') throw errors.INVALID_ARGUMENT('peerPubKey must be specified');
  },
  HAS_PAIR_ID: ({ pairId }: { pairId: string }) => { if (pairId === '') throw errors.INVALID_ARGUMENT('pairId must be specified'); },
  HAS_RHASH: ({ rHash }: { rHash: string }) => { if (rHash === '') throw errors.INVALID_ARGUMENT('rHash must be specified'); },
  POSITIVE_AMOUNT: ({ amount }: { amount: number }) => { if (amount <= 0) throw errors.INVALID_ARGUMENT('amount must be greater than 0'); },
  POSITIVE_QUANTITY: ({ quantity }: { quantity: number }) => { if (quantity <= 0) throw errors.INVALID_ARGUMENT('quantity must be greater than 0'); },
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
    if (!SwapClientType[swapClient]) throw errors.INVALID_ARGUMENT('swap client is not recognized');
  },
};

/** Class containing the available RPC methods for XUD */
class Service {
  public shutdown: () => void;
  private orderBook: OrderBook;
  private swapClientManager: SwapClientManager;
  private pool: Pool;
  private version: string;
  private swaps: Swaps;

  /** Create an instance of available RPC methods and bind all exposed functions. */
  constructor(components: ServiceComponents) {
    this.shutdown = components.shutdown;
    this.orderBook = components.orderBook;
    this.swapClientManager = components.swapClientManager;
    this.pool = components.pool;
    this.swaps = components.swaps;

    this.version = components.version;
  }

  /** Adds a currency. */
  public addCurrency = async (args: { currency: string, swapClient: SwapClientType | number, decimalPlaces: number, tokenAddress?: string}) => {
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
  public removeOrder = (args: { orderId: string, quantity?: number }) => {
    const { orderId, quantity } = args;
    argChecks.HAS_ORDER_ID(args);

    return this.orderBook.removeOwnOrderByLocalId(orderId, quantity);
  }

  /** Gets the total lightning network channel balance for a given currency. */
  public channelBalance = async (args: { currency: string }) => {
    const { currency } = args;
    const balances = new Map<string, { balance: number, pendingOpenBalance: number }>();
    const getBalance = async (currency: string) => {
      const swapClient = this.swapClientManager.get(currency.toUpperCase());
      if (swapClient) {
        const channelBalance = await swapClient.channelBalance();
        return channelBalance;
      } else {
        throw swapsErrors.SWAP_CLIENT_NOT_FOUND(currency);
      }
    };

    if (currency) {
      argChecks.VALID_CURRENCY(args);
      balances.set(currency, await getBalance(currency));
    } else {
      for (const currency of this.orderBook.currencies) {
        balances.set(currency, await getBalance(currency));
      }
    }

    return balances;
  }

  /**
   * Connect to an XU node on a given node uri.
   */
  public connect = async (args: { nodeUri: string, retryConnecting: boolean }) => {
    const { nodeUri, retryConnecting } = args;

    let uriParts: UriParts;
    try {
      uriParts = parseUri(nodeUri);
    } catch (err) {
      throw errors.INVALID_ARGUMENT('uri is invalid');
    }
    const { nodePubKey, host, port } = uriParts;
    argChecks.HAS_NODE_PUB_KEY({ nodePubKey });
    argChecks.HAS_HOST({ host });
    argChecks.VALID_PORT({ port });

    await this.pool.addOutbound({ host, port }, nodePubKey, retryConnecting, true);
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
    await this.pool.unbanNode(args.nodePubKey, args.reconnect);
  }

  public executeSwap = async (args: { orderId: string, pairId: string, peerPubKey: string, quantity: number }) => {
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
    const { nodePubKey, addresses } = this.pool.nodeState;

    const uris: string[] = [];

    if (addresses && addresses.length > 0) {
      addresses.forEach((address) => {
        uris.push(toUri({ nodePubKey, host: address.host, port: address.port }));
      });
    }

    let peerOrdersCount = 0;
    let ownOrdersCount = 0;
    let numPairs = 0;
    for (const pairId of this.orderBook.pairIds) {
      const peerOrders = this.orderBook.getPeersOrders(pairId);
      const ownOrders = this.orderBook.getOwnOrders(pairId);

      peerOrdersCount += Object.keys(peerOrders.buyArray).length + Object.keys(peerOrders.sellArray).length;
      ownOrdersCount += Object.keys(ownOrders.buyArray).length + Object.keys(ownOrders.sellArray).length;
      numPairs += 1;
    }

    const lnd = await this.swapClientManager.getLndClientsInfo();
    const raiden = await this.swapClientManager.raidenClient.getRaidenInfo();

    return {
      lnd,
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
  public listOrders = (args: { pairId: string, includeOwnOrders: boolean, limit: number }): Map<string, OrderSidesArrays<any>> => {
    const { pairId, includeOwnOrders, limit } = args;

    const result = new Map<string, OrderSidesArrays<any>>();

    const listOrderTypes = (pairId: string) => {
      const  orders: OrderSidesArrays<any> = {
        buyArray: [],
        sellArray: [],
      };

      const peerOrders = this.orderBook.getPeersOrders(pairId);
      orders.buyArray = peerOrders.buyArray;
      orders.sellArray = peerOrders.sellArray;

      if (includeOwnOrders) {
        const ownOrders = this.orderBook.getOwnOrders(pairId);

        orders.buyArray = [...orders.buyArray, ...ownOrders.buyArray];
        orders.sellArray = [...orders.sellArray, ...ownOrders.sellArray];
      }

      // sort all orders
      orders.buyArray = sortOrders(orders.buyArray, true);
      orders.sellArray = sortOrders(orders.sellArray, false);

      if (limit > 0) {
        orders.buyArray = orders.buyArray.slice(0, limit);
        orders.sellArray = orders.buyArray.slice(0, limit);
      }
      return orders;
    };

    if (pairId) {
      result.set(pairId, listOrderTypes(pairId));
    } else {
      this.orderBook.pairIds.forEach((pairId) => {
        result.set(pairId, listOrderTypes(pairId));
      });
    }

    return result;
  }

  /**
   * Get the list of the order book's supported currencies
   * @returns A list of supported currency ticker symbols
   */
  public listCurrencies = () => {
    return Array.from(this.orderBook.currencies);
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
    argChecks.POSITIVE_QUANTITY(args);
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

  /** Discover nodes from a specific peer and apply new connections */
  public discoverNodes = async (args: { peerPubKey: string }) => {
    argChecks.HAS_PEER_PUB_KEY(args);
    const { peerPubKey } = args;

    return this.pool.discoverNodes(peerPubKey);
  }

  /*
   * Subscribe to orders being added to the order book.
   */
  public subscribeOrders = (args: { existing: boolean }, callback: (order?: Order, orderRemoval?: OrderPortion) => void) => {
    if (args.existing) {
      this.orderBook.pairIds.forEach((pair) => {
        const ownOrders = this.orderBook.getOwnOrders(pair);
        const peerOrders = this.orderBook.getPeersOrders(pair);
        ownOrders.buyArray.forEach(order => callback(order));
        peerOrders.buyArray.forEach(order => callback(order));
        ownOrders.sellArray.forEach(order => callback(order));
        peerOrders.sellArray.forEach(order => callback(order));
      });
    }

    this.orderBook.on('peerOrder.incoming', order => callback(order));
    this.orderBook.on('ownOrder.added', order => callback(order));

    this.orderBook.on('peerOrder.invalidation', orderRemoval => callback(undefined, orderRemoval));
    this.orderBook.on('peerOrder.filled', orderRemoval => callback(undefined, orderRemoval));
    this.orderBook.on('ownOrder.filled', orderRemoval => callback(undefined, orderRemoval));
    this.orderBook.on('ownOrder.removed', orderRemoval => callback(undefined, orderRemoval));
  }

  /*
   * Subscribe to completed swaps.
   */
  public subscribeSwaps = async (args: { includeTaker: boolean }, callback: (swapSuccess: SwapSuccess) => void) => {
    this.swaps.on('swap.paid', (swapSuccess) => {
      // always alert client for maker matches, taker matches only when specified
      if (swapSuccess.role === SwapRole.Maker || args.includeTaker) {
        callback(swapSuccess);
      }
    });
  }

  /*
   * Subscribe to failed swaps.
   */
  public subscribeSwapFailures = async (args: { includeTaker: boolean }, callback: (swapFailure: SwapFailure) => void) => {
    this.swaps.on('swap.failed', (deal) => {
      // always alert client for maker matches, taker matches only when specified
      if (deal.role === SwapRole.Maker || args.includeTaker) {
        callback(deal as SwapFailure);
      }
    });
  }

  /**
   * Resolves a hash to its preimage.
   */
  public resolveHash = async (request: ResolveRequest) => {
    argChecks.HAS_RHASH(request);
    argChecks.POSITIVE_AMOUNT(request);
    return this.swaps.handleResolveRequest(request);
  }
}
export default Service;
export { ServiceComponents };
