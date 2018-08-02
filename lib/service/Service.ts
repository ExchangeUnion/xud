import Logger from '../Logger';
import Pool from '../p2p/Pool';
import OrderBook, { OrderArrays } from '../orderbook/OrderBook';
import LndClient from '../lndclient/LndClient';
import RaidenClient, { TokenSwapPayload } from '../raidenclient/RaidenClient';
import { OwnOrder } from '../types/orders';
import Config from '../Config';
import { EventEmitter } from 'events';
import SocketAddress from '../p2p/SocketAddress';
import errors from './errors';

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

function checkArgument(expectedCondition: boolean, message: string) {
    if (!expectedCondition) {
        throw errors.INVALID_ARGUMENT(message);
    }
}

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
     * Get a list of standing peer orders from the order book for a specified trading pair, or for all
     * trading pairs if no pair is specified.
     */
    public getOrders = ({ pairId, maxResults }: { pairId?: string, maxResults?: number }) => {
        const ret: OrderArrays = {
            buyOrders: [],
            sellOrders: [],
        };
        if (pairId) {
            const orderArrays = this.orderBook.getPeerOrders(pairId, maxResults ? maxResults : 0);
            ret.buyOrders.concat(orderArrays.buyOrders);
            ret.sellOrders.concat(orderArrays.sellOrders);
        } else {
            this.orderBook.pairs.forEach((pair) => {
                const orderArrays = this.orderBook.getPeerOrders(pair.id, maxResults ? maxResults : 0);
                ret.buyOrders.concat(orderArrays.buyOrders);
                ret.sellOrders.concat(orderArrays.sellOrders);
            });
        }
        return ret;
    }

    /**
     * Add an order to the order book.
     */
    public placeOrder = async (order: OwnOrder) => {
        checkArgument(order.price >= 0, 'price cannot be negative');
        checkArgument(order.quantity !== 0, 'quantity must not equal 0');

        return order.price > 0 ? this.orderBook.addLimitOrder(order) : this.orderBook.addMarketOrder(order);
    }

    /*
     * Cancel placed order from the orderbook.
     */
    public cancelOrder = async ({ orderId, pairId }: { orderId: string, pairId: string }) => {
        this.pool.broadcastOrderInvalidation(orderId, pairId);
        return { canceled: this.orderBook.removeOwnOrderByLocalId(pairId, orderId) };
    }

    /**
     * Connect to an XU node on a given host and port.
     */
    public connect = async ({ host, port }: { host: string, port: number }) => {
        const peer = await this.pool.addOutbound(new SocketAddress(host, port));
        return peer.getStatus();
    }

    /*
     * Disconnect from a connected peer XU node on a given host and port.
     */
    public disconnect = async ({ host, port }: { host: string, port: number}) => {
        await this.pool.disconnectPeer(host, port);
        return 'success';
    }

    /**
     * Execute an atomic swap
     */
    public executeSwap = async ({ target_address, payload, identifier }: { target_address: string, payload: TokenSwapPayload, identifier: string }) => {
        return this.raidenClient.tokenSwap(target_address, payload, identifier);
    }

    /*
     * Subscribe to incoming peer orders.
     */
    public subscribePeerOrders = async (callback: Function) => {
        this.orderBook.on('peerOrder', order => callback(order));
    }

    /*
     * Subscribe to executed swaps
     */
    public subscribeSwaps = async (_callback: Function) => {};
}

export default Service;