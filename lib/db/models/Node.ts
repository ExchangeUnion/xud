import Sequelize from 'sequelize';
import * as db from '../types';
import { Address } from '../../p2p/types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.NodeAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nodePubKey: { type: DataTypes.STRING, unique: true, allowNull: false },
    addressesText: { type: Sequelize.TEXT, allowNull: false },
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
    lastAddressText: { type: Sequelize.TEXT, allowNull: true },
    lastAddress: {
      type: Sequelize.VIRTUAL,
      allowNull: true,
      get(this: db.NodeInstance) {
        return this.lastAddressText ? JSON.parse(this.lastAddressText) : undefined;
      },
      set(this: db.NodeInstance, value: Address) {
        if (value) {
          this.setDataValue('lastAddressText', JSON.stringify(value));
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

  Node.associate = (models: Sequelize.Models) => {
    models.Node.hasMany(models.ReputationEvent, {
      foreignKey: 'nodeId',
      constraints: true,
    });
  };

  return Node;
};
