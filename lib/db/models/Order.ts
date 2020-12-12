import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { OrderInstance } from '../types';

export default function Order(sequelize: Sequelize) {
  const attributes: ModelAttributes<OrderInstance> = {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    nodeId: { type: DataTypes.INTEGER, allowNull: true },
    localId: { type: DataTypes.STRING, allowNull: true },
    initialQuantity: { type: DataTypes.BIGINT, allowNull: false },
    pairId: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      set(this: OrderInstance, value: number) {
        if (value === 0 || value === Number.POSITIVE_INFINITY) {
          this.setDataValue('price', undefined);
        } else {
          this.setDataValue('price', value);
        }
      },
    },
    isBuy: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.BIGINT, allowNull: false },
  };

  const options: ModelOptions = {
    tableName: 'orders',
    timestamps: false,
  };

  return sequelize.define<OrderInstance>('Order', attributes, options);
}
