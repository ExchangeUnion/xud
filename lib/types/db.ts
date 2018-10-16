import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize';
import { Address, NodeConnectionInfo } from './p2p';
import { Currency, Pair, SwapDeal } from './orders';
import { ReputationEvent } from './enums';

export type SequelizeAttributes<T extends { [key: string]: any }> = {
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

// Currencys
export type CurrencyFactory = Currency;

export type CurrencyAttributes = CurrencyFactory & {
  tokenAddress: string;
};

export type CurrencyInstance = CurrencyAttributes & Sequelize.Instance<CurrencyAttributes>;

// SwapDeals
export type SwapDealFactory = SwapDeal;

export type SwapDealAttributes = SwapDealFactory & {};

export type SwapDealInstance = SwapDealAttributes & Sequelize.Instance<SwapDealAttributes>;

// Nodes
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

// Pairs
export type PairFactory = Pair;

export type PairAttributes = PairFactory & {
  id: string;
};

export type PairInstance = PairAttributes & Sequelize.Instance<PairAttributes>;

// Reputation events
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
