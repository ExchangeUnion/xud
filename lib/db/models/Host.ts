import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.HostAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    address: { type: DataTypes.STRING(39), allowNull: false },
    port: { type: DataTypes.INTEGER, allowNull: false },
    pubKey: { type: DataTypes.STRING, allowNull: true, unique: true },
  };

  const indexes: Sequelize.DefineIndexesOptions[] = [{
    unique: true,
    fields: ['address', 'port'],
  }];

  const options: Sequelize.DefineOptions<db.HostInstance> = {
    indexes,
    tableName: 'hosts',
  };

  const Peer = sequelize.define<db.HostInstance, db.HostAttributes>('Host', attributes, options);

  return Peer;
};
