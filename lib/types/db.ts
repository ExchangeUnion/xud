import Sequelize, { DataTypeAbstract, DefineAttributeColumnOptions } from 'sequelize';

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

export type CurrencyFactory = {
  id: string;
};

export type CurrencyAttributes = CurrencyFactory;

export type CurrencyInstance = CurrencyAttributes & Sequelize.Instance<CurrencyAttributes>;

export type HostFactory = {
  address: string;
  port: number;
};

export type HostAttributes = HostFactory & {
  id: number;
  pubKey: string;
};

export type HostInstance = HostAttributes & Sequelize.Instance<HostAttributes>;

export type BannedHostFactory = {
  address: string;
};

export type BannedHostAttributes = BannedHostFactory;

export type BannedHostInstance = HostAttributes & Sequelize.Instance<HostAttributes>;

export type OrderFactory = {
  id: string;
  pairId: string;
  hostId?: number;
  quantity: number;
  price: number;
  createdAt?: Date;
};

export type OrderAttributes = {
  id: string;
  pairId: string;
  hostId: number;
  quantity: number | Sequelize.literal;
  price: number;
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
