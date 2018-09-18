import Sequelize from 'sequelize';
import { db } from '../../types';
import { Address } from '../../types/p2p';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.NodeAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nodePubKey: { type: DataTypes.STRING, unique: true, allowNull: false },
    addressesText: { type: Sequelize.TEXT, allowNull: false },
    lastAddressText: { type: Sequelize.TEXT, allowNull: false },
    lastAddress: {
      type: Sequelize.VIRTUAL,
      get(this: db.NodeInstance) {
        return JSON.parse(this.lastAddressText);
      },
      set(this: db.NodeInstance, value: Address) {
        this.setDataValue('lastAddressText', value ? JSON.stringify(value) : '');
      },
    },
    addresses: {
      type: Sequelize.VIRTUAL,
      get(this: db.NodeInstance) {
        return JSON.parse(this.addressesText);
      },
      set(this: db.NodeInstance, value: Address[]) {
        if (value) {
          this.setDataValue('addressesText', JSON.stringify(value));
        } else {
          this.setDataValue('addressesText', '[]');
        }
      },
    },
    banned: { type: DataTypes.BOOLEAN, allowNull: true },
  };

  const indexes: Sequelize.DefineIndexesOptions[] = [{
    unique: true,
    fields: ['nodePubKey'],
  }];

  const options: Sequelize.DefineOptions<db.NodeInstance> = {
    indexes,
    tableName: 'nodes',
  };

  const Node = sequelize.define<db.NodeInstance, db.NodeAttributes>('Node', attributes, options);

  return Node;
};
