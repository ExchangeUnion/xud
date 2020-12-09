import { ConnextInfo } from '../connextclient/types';
import { OrderSide, SwapRole } from '../constants/enums';
import { LndInfo } from '../lndclient/types';
import Logger from '../Logger';
import OrderBook from '../orderbook/OrderBook';
import { Order, PlaceOrderEvent } from '../orderbook/types';
import Pool from '../p2p/Pool';
import SwapClientManager from '../swaps/SwapClientManager';
import Swaps from '../swaps/Swaps';
import NodeKey from '../nodekey/NodeKey';

/**
 * The components required by the API service layer.
 */
export type ServiceComponents = {
  orderBook: OrderBook;
  swapClientManager: SwapClientManager;
  pool: Pool;
  /** The version of the local xud instance. */
  version: string;
  swaps: Swaps;
  logger: Logger;
  nodeKey: NodeKey;
  /** The function to be called to shutdown the parent process */
  shutdown: () => void;
};

export type XudInfo = {
  version: string;
  nodePubKey: string;
  uris: string[];
  network: string;
  alias: string;
  numPeers: number;
  numPairs: number;
  orders: { peer: number; own: number };
  lnd: Map<string, LndInfo>;
  connext?: ConnextInfo;
  pendingSwapHashes: string[];
};

export type NodeIdentifier = {
  nodePubKey: string;
  alias?: string;
};

export type ServiceOrder = Pick<
  Order,
  Exclude<keyof Order, 'peerPubKey' | 'isBuy' | 'initialQuantity' | 'quantity' | 'price'>
> & {
  nodeIdentifier: NodeIdentifier;
  side: OrderSide;
  localId?: string;
  hold?: number;
  isOwnOrder: boolean;
  quantity?: number;
  price?: number;
};

export type ServiceTrade = {
  makerOrder: ServiceOrder;
  takerOrder?: ServiceOrder;
  rHash?: string;
  quantity: number;
  pairId: string;
  price: number;
  role: SwapRole;
  side: OrderSide;
  executedAt: number;
  counterparty?: NodeIdentifier;
};

export type ServiceOrderSidesArrays = {
  buyArray: ServiceOrder[];
  sellArray: ServiceOrder[];
};

export type ServicePlaceOrderEvent = Pick<PlaceOrderEvent, Exclude<keyof PlaceOrderEvent, 'order'>> & {
  order?: ServiceOrder;
};
