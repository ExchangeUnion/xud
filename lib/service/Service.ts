import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook from '../orderbook/OrderBook';
import LndClient, { LndInfo } from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload, RaidenInfo } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';
import Config from '../Config';
import { EventEmitter } from 'events';
import errors from './errors';
import * as packets from '../p2p/packets/types';
import { CurrencyType, SwapDealRole } from '../types/enums';
import { SwapDeal } from '../orderbook/SwapDeals';
import { randomBytes } from 'crypto';
import { parseUri, getUri, UriParts } from '../utils/utils';

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
  /** The version of the local xud instance. */
  version: string;
  /** The function to be called to shutdown the parent process */
  shutdown: () => string;
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
  public shutdown: () => string;
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
  public executeSwap = ({ targetAddress, payload }: { targetAddress: string, payload?: TokenSwapPayload })  => {
    let body: packets.DealRequestPacketBody;
    let takerPubKey: string | undefined;
    let takerCoin: CurrencyType;
    let makerCoin: CurrencyType;

    if (!payload) {
      return 'no payload provided';
    }
    if (targetAddress) {
      return 'target address provided';
    }
    if (!payload.role || payload.role.toUpperCase() !== 'TAKER') {
      return 'role, if provided, must be of "taker"';
    }

    if (!payload.receivingToken ||
      (payload.receivingToken.toUpperCase() !== 'BTC' && payload.receivingToken.toUpperCase() !== 'LTC')) {
      return 'receivingToken can only be LTC or BTC';
    }

    switch (payload.receivingToken.toUpperCase()){
      case 'BTC':
        takerPubKey = this.lndBtcClient.pubKey;
        takerCoin = CurrencyType.BTC;
        makerCoin = CurrencyType.LTC;
        break;
      case 'LTC':
        takerPubKey = this.lndLtcClient.pubKey;
        takerCoin = CurrencyType.LTC;
        makerCoin = CurrencyType.BTC;
        break;
      default:
        return 'Invalid receiving token';
    }

    if (!takerPubKey) {
      return 'Taker\'s LND is not connected';
    }

    body =  {
      takerCoin,
      makerCoin,
      takerPubKey,
      takerDealId: randomBytes(32).toString('hex'),
      takerAmount: payload.receivingAmount,
      makerAmount: payload.sendingAmount,
    };

    const deal: SwapDeal = {
      myRole : SwapDealRole.Taker,
      takerAmount : body.takerAmount,
      takerCoin : body.takerCoin,
      takerPubKey: body.takerPubKey,
      takerDealId: body.takerDealId,
      makerAmount: body.makerAmount,
      makerCoin: body.makerCoin,
      createTime: Date.now(),
    };
    this.pool.swapDeals.add(deal);
    this.logger.debug(' swap deal: ' + JSON.stringify(deal));

    this.logger.debug('sending to peer ' + payload.nodePubKey + ': ' + JSON.stringify(body));
    const packet = new packets.DealRequest(body);

    const error = this.pool.sendToPeer(payload.nodePubKey, packet);
    if (error) {
      return error.message;
    }
    // Todo: wait for swap to complete and provide the preimage back to the caller
    return 'Success';
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

    const pairIds = this.orderBook.pairIds;

    let peerOrdersCount = 0;
    let ownOrdersCount = 0;
    pairIds.forEach((pairId) => {
      const peerOrders = this.orderBook.getPeerOrders(pairId, 0);
      const ownOrders = this.orderBook.getOwnOrders(pairId, 0);

      peerOrdersCount += Object.keys(peerOrders.buyOrders).length + Object.keys(peerOrders.sellOrders).length;
      ownOrdersCount += Object.keys(ownOrders.buyOrders).length + Object.keys(ownOrders.sellOrders).length;
    });

    const lndbtc = this.lndBtcClient.isDisabled() ? undefined : await this.lndBtcClient.getLndInfo();
    const lndltc = this.lndLtcClient.isDisabled() ? undefined : await this.lndLtcClient.getLndInfo();

    const raiden = this.raidenClient.isDisabled() ? undefined : await this.raidenClient.getRaidenInfo();

    return {
      lndbtc,
      lndltc,
      raiden,
      nodePubKey,
      uris,
      version: this.version,
      numPeers: this.pool.peerCount,
      numPairs: pairIds.length,
      orders: {
        peer: peerOrdersCount,
        own: ownOrdersCount,
      },
    };
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
   * resolveHash resolve hash to preImage.
   */
  public resolveHash = async (args: { hash: string }) => {
    const { hash } = args;

    this.logger.info('ResolveHash stating with hash: ' + hash);

    const deal: SwapDeal | undefined = this.pool.swapDeals.findByHash(hash);

    if (!deal) {
      this.logger.error('Something went wrong. Can\'t find deal: ' + hash);
      return 'Somthing is worng';
    }

	// If I'm the taker I need to forward the payment to the other chanin
	// TODO: check that I got the right amount before sending out the agreed amount
    // TODO: calculate CLTV
    if (deal.myRole === SwapDealRole.Taker) {
	  this.logger.debug('Executing taker code');
      let cmdLnd = this.lndBtcClient;

      switch (deal.makerCoin) {
        case CurrencyType.BTC:
          break;
        case CurrencyType.LTC:
          cmdLnd = this.lndLtcClient;
          break;
      }

      // resp, err := cmdLnd.SendPaymentSync(lncctx,&lnrpc.SendRequest{
      //   DestString:deal.makerPubKey,
      //   Amt:deal.makerAmount,
      //   PaymentHash:deal.hash[:],
      // })
      // if err != nil{
      //   err = fmt.Errorf("Got error sending  %d %v by taker - %v",
      //         deal.makerAmount,deal.makerCoin.String(),err)
      //   log.Printf(err.Error())
      //   return nil, err
      // }
      // if resp.PaymentError != ""{
      //   err = fmt.Errorf("Got PaymentError sending %d %v by taker - %v",
      //       deal.makerAmount,deal.makerCoin.String(), resp.PaymentError)
      //   log.Printf(err.Error())
      //   return nil, err
      // }

      // this.logger.info('sendPayment response from maker to taker:' + JSON.stringify(resp))

      return 'preImage to here';
    }

	// If we are here we are the maker
    this.logger.debug('Executing maker code');

    return String(deal.preImage);
  }

}

export default Service;
