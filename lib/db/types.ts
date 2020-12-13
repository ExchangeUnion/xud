import { BelongsToGetAssociationMixin, Model } from 'sequelize';
import { ReputationEvent, SwapClientType } from '../constants/enums';
import { Currency, Order, Pair } from '../orderbook/types';
import { Address, NodeConnectionInfo } from '../p2p/types';
import { SwapDeal } from '../swaps/types';

/*
 * The following definitions are in sets of triplets, one for each Model (which represents a table in the database).
 *
 * "xCreationAttributes" is the type definition for the object which is required when a new record is to be created.
 *
 * "xAttributes" is the type definition of the record.
 *
 * "xInstance" is the type definition of a fetched record as a Sequelize row instance, which contains some util properties.
 */

/* Currency */
export type CurrencyCreationAttributes = Currency;

export type CurrencyAttributes = CurrencyCreationAttributes;

export interface CurrencyInstance extends Model<CurrencyAttributes, CurrencyCreationAttributes>, CurrencyAttributes {}

/* SwapDeal */
export type SwapDealCreationAttributes = Pick<
  SwapDeal,
  Exclude<keyof SwapDeal, 'takerMaxTimeLock' | 'price' | 'pairId' | 'isBuy' | 'takerUnits' | 'makerUnits'>
>;

export type SwapDealAttributes = SwapDealCreationAttributes & {
  /** The internal db node id of the counterparty peer for this swap deal. */
  nodeId: number;
};

export interface SwapDealInstance extends Model<SwapDealAttributes, SwapDealCreationAttributes>, SwapDealAttributes {
  getNode: BelongsToGetAssociationMixin<NodeInstance>;
  getOrder: BelongsToGetAssociationMixin<OrderInstance>;
  Node?: NodeInstance;
  Order?: OrderInstance;
}

export type OrderCreationAttributes = Pick<Order, Exclude<keyof Order, 'quantity' | 'hold' | 'price'>> & {
  /** The internal db node id of the peer that created this order. */
  nodeId?: number;
  localId?: string;
  /** The price for the order expressed in units of the quote currency. */
  price?: number;
};

export type OrderAttributes = OrderCreationAttributes & {};

export interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes {}

export type TradeCreationAttributes = {
  /** The order id of the maker order involved in this trade. */
  makerOrderId: string;
  /** The order id of the taker order involved in this trade, if applicable. */
  takerOrderId?: string;
  /** The rHash of the swap that filled this trade, if applicable. */
  rHash?: string;
  /** The quantity transacted in this trade. */
  quantity: number;
};

export type TradeAttributes = TradeCreationAttributes & {};

export interface TradeInstance extends Model<TradeAttributes, TradeCreationAttributes>, TradeAttributes {
  getMakerOrder: BelongsToGetAssociationMixin<OrderInstance>;
  getTakerOrder: BelongsToGetAssociationMixin<OrderInstance>;
  getSwapDeal: BelongsToGetAssociationMixin<SwapDealInstance>;
  SwapDeal?: SwapDealInstance;
  makerOrder?: OrderInstance;
  takerOrder?: OrderInstance;
  createdAt: Date;
}

/* Node */
export type NodeCreationAttributes = NodeConnectionInfo;

export type NodeAttributes = NodeCreationAttributes & {
  id: number;
  banned: boolean;
  addressesText: string;
  lastAddressText: string;
  lastAddress: Address;
  consecutiveConnFailures: number;
};

export interface NodeInstance extends Model<NodeAttributes, NodeCreationAttributes>, NodeAttributes {
  reputationScore: number;
}

/* Pairs */
export type PairCreationAttributes = Pair;

export type PairAttributes = PairCreationAttributes & {
  id: string;
};

export interface PairInstance extends Model<PairAttributes, PairCreationAttributes>, PairAttributes {}

/* Reputation events */
export type ReputationEventCreationAttributes = {
  event: ReputationEvent;
  nodeId: number;
};

export type ReputationEventAttributes = ReputationEventCreationAttributes & {
  createdAt: number;
  id: number;
};

export interface ReputationEventInstance
  extends Model<ReputationEventAttributes, ReputationEventCreationAttributes>,
    ReputationEventAttributes {}

/* Passwords */
export type PasswordCreationAttributes = {
  encryptedPassword: string;
  currency?: string;
  swapClient: SwapClientType;
};

export type PasswordAttributes = PasswordCreationAttributes & {
  createdAt: number;
  id: number;
};

export interface PasswordInstance extends Model<PasswordAttributes, PasswordCreationAttributes>, PasswordAttributes {}
