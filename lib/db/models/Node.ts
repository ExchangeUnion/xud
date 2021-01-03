import { DataTypes, IndexesOptions, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { Address } from '../../p2p/types';
import { NodeInstance } from '../types';

export default function Node(sequelize: Sequelize) {
  const attributes: ModelAttributes<NodeInstance> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nodePubKey: { type: DataTypes.STRING, unique: true, allowNull: false },
    addressesText: { type: DataTypes.TEXT, allowNull: false },
    addresses: {
      type: DataTypes.VIRTUAL,
      get(this: NodeInstance) {
        return JSON.parse(this.addressesText);
      },
      set(this: NodeInstance, value: Address[]) {
        if (value) {
          this.setDataValue('addressesText', JSON.stringify(value));
        } else {
          this.setDataValue('addressesText', '[]');
        }
      },
    },
    lastAddressText: { type: DataTypes.TEXT, allowNull: true },
    lastAddress: {
      type: DataTypes.VIRTUAL,
      allowNull: true,
      get(this: NodeInstance) {
        return this.lastAddressText ? JSON.parse(this.lastAddressText) : undefined;
      },
      set(this: NodeInstance, value: Address) {
        if (value) {
          this.setDataValue('lastAddressText', JSON.stringify(value));
        }
      },
    },
    banned: { type: DataTypes.BOOLEAN, allowNull: true },
    consecutiveConnFailures: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  };

  const indexes: IndexesOptions[] = [
    {
      unique: true,
      fields: ['nodePubKey'],
    },
  ];

  const options: ModelOptions = {
    indexes,
    tableName: 'nodes',
  };

  return sequelize.define<NodeInstance>('Node', attributes, options);
}
