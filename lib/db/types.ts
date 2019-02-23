import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions, DefineAttributes } from 'sequelize';
import { Address, NodeConnectionInfo } from '../p2p/types';
import { SwapDeal } from '../swaps/types';
import { Currency, Pair, OwnOrder, Order } from '../orderbook/types';
import { ReputationEvent } from '../constants/enums';

export type SequelizeAttributes<T extends { [key: string]: any }> = DefineAttributes & {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
};

/*
* The following definitions are in sets of triplets, one for each Model (which represents a table in the database).
*
* "xFactory" is the type definition for the object which is required when a new record is to be created.
*
* "xAttributes" is the type definition of the record. It cannot support nullables, as it is being used for the table's columns definition.
*
* "xInstance" is the type definition of a fetched record as a Sequelize row instance, which contains some util properties.
*/

/* Currency */
export type CurrencyFactory = Currency;

export type CurrencyAttributes = CurrencyFactory & {
  tokenAddress: string;
};

export type CurrencyInstance = CurrencyAttributes & Sequelize.Instance<CurrencyAttributes>;

/* SwapDeal */
export type SwapDealFactory = Pick<SwapDeal, Exclude<keyof SwapDeal, 'makerToTakerRoutes' | 'price' | 'pairId' | 'isBuy'>>;

export type SwapDealAttributes = SwapDealFactory & {
  /** The internal db node id of the counterparty peer for this swap deal. */
  nodeId: number;
  Node?: NodeAttributes;
  Order?: OrderAttributes;
};

export type SwapDealInstance = SwapDealAttributes & Sequelize.Instance<SwapDealAttributes> & {
  getNode: Sequelize.BelongsToGetAssociationMixin<NodeInstance>;
  getOrder: Sequelize.BelongsToGetAssociationMixin<OrderInstance>;
};

export type OrderFactory = Pick<Order, Exclude<keyof Order, 'quantity' | 'hold' | 'price'>> & {
  /** The internal db node id of the peer that created this order. */
  nodeId?: number;
  localId?: string;
  /** The price for the order expressed in units of the quote currency. */
  price?: number;
};

export type OrderAttributes = OrderFactory & {
};

export type OrderInstance = OrderAttributes & Sequelize.Instance<OrderAttributes>;

export type TradeFactory = {
  /** The order id of the maker order involved in this trade. */
  makerOrderId: string,
  /** The order id of the taker order involved in this trade, if applicable. */
  takerOrderId?: string,
  /** The rHash of the swap that filled this trade, if applicable. */
  rHash?: string,
  /** The quantity transacted in this trade. */
  quantity: number,
};

export type TradeAttributes = TradeFactory;

export type TradeInstance = TradeAttributes & Sequelize.Instance<TradeAttributes> & {
  getMakerOrder: Sequelize.BelongsToGetAssociationMixin<OrderInstance>;
  getTakerOrder: Sequelize.BelongsToGetAssociationMixin<OrderInstance>;
  getSwapDeal: Sequelize.BelongsToGetAssociationMixin<SwapDealInstance>;
};

/* Node */
export type NodeFactory = NodeConnectionInfo;

export type NodeAttributes = NodeFactory & {
  id: number;
  banned: boolean;
  addressesText: string;
  lastAddressText: string;
  lastAddress: Address;
};

export type NodeInstance = NodeAttributes & Sequelize.Instance<NodeAttributes> & {
  reputationScore: number;
};

/* Pairs */
export type PairFactory = Pair;

export type PairAttributes = PairFactory & {
  id: string;
};

export type PairInstance = PairAttributes & Sequelize.Instance<PairAttributes>;

/* Reputation events */
export type ReputationEventFactory = {
  event: ReputationEvent;
  nodeId: number;
};

export type ReputationEventAttributes = ReputationEventFactory & {
  id: number;
};

export type ReputationEventInstance = ReputationEventAttributes & Sequelize.Instance<ReputationEventAttributes> & {
  createdAt: number;
};
