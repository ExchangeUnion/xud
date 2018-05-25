import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize';
import { db } from './index';

export type SequelizeAttributes<T extends { [key: string]: any }> = {
  [P in keyof T]: string | DataTypeAbstract | DefineAttributeColumnOptions
};

export type CurrencyFactory = {
  id: string;
};

export type CurrencyAttributes = CurrencyFactory;

export type CurrencyInstance = CurrencyAttributes & Sequelize.Instance<CurrencyAttributes>;

export type PeerFactory = {
  address: string;
  port: string;
};

export type PeerAttributes = PeerFactory & {
  id: number;
  pubKey: string;
};

export type PeerInstance = PeerAttributes & Sequelize.Instance<PeerAttributes>;

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

export type OrderInstance = OrderAttributes & Sequelize.Instance<OrderAttributes>;

export type PairFactory = {
  baseCurrency: string;
  quoteCurrency: string;
  swapProtocol: string;
};

export type PairAttributes = PairFactory & {
  id: string;
};

export type PairInstance = PairAttributes & Sequelize.Instance<PairAttributes>;
