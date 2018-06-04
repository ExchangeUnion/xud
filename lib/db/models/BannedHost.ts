import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.BannedHostAttributes> = {
    address: { type: DataTypes.STRING(39), primaryKey: true },
  };

  const options: Sequelize.DefineOptions<db.BannedHostInstance> = {
    tableName: 'bannedHosts',
  };

  const BannedHost = sequelize.define<db.BannedHostInstance, db.BannedHostAttributes>('BannedHost', attributes, options);

  return BannedHost;
};
