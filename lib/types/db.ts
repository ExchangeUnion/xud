import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize';
import { db } from './index';

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
};

export type CurrencyFactory = {
  id: string;
};

export type CurrencyAttributes = CurrencyFactory;

export type CurrencyInstance = Sequelize.Instance<db.CurrencyAttributes> & db.CurrencyAttributes;

export type PeerFactory = {
  address: string;
  port: string;
};

export type PeerAttributes = PeerFactory & {
  id: number;
  pubKey: string;
};

export type PeerInstance = Sequelize.Instance<db.PeerAttributes> & db.PeerAttributes;

export type OrderFactory = {
  id: string;
  pairId: string;
  peerId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
};

export type OrderAttributes = OrderFactory & {
  createdAt: Date;
};

export type OrderInstance = Sequelize.Instance<db.OrderAttributes> & db.OrderAttributes;

export type PairFactory = {
  baseCurrency: string;
  quoteCurrency: string;
  swapProtocol: string;
};

export type PairAttributes = PairFactory & {
  id: string;
};

export type PairInstance = Sequelize.Instance<db.PairAttributes> & db.PairAttributes;
