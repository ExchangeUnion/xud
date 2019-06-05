import Sequelize from 'sequelize';
import * as db from '../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.OrderAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    nodeId: { type: DataTypes.INTEGER, allowNull: true },
    localId: { type: DataTypes.STRING, allowNull: true },
    initialQuantity: { type: DataTypes.BIGINT, allowNull: false },
    pairId: { type: DataTypes.STRING, allowNull: false },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      set(this: db.OrderInstance, value: number) {
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

  const options: Sequelize.DefineOptions<db.OrderInstance>  = {
    tableName: 'orders',
    timestamps: false,
  };

  const Order = sequelize.define<db.OrderInstance, db.OrderAttributes>('Order', attributes, options);

  Order.associate = (models: Sequelize.Models) => {
    models.Order.belongsTo(models.Node, {
      foreignKey: 'nodeId',
      constraints: true,
    });
    models.Order.belongsTo(models.Pair, {
      foreignKey: 'pairId',
      constraints: false,
    });
    models.Order.hasMany(models.Trade, {
      as: 'makerTrades',
      foreignKey: 'makerOrderId',
      constraints: true,
    });
    models.Order.hasMany(models.Trade, {
      as: 'takerTrades',
      foreignKey: 'takerOrderId',
      constraints: true,
    });
    models.Order.hasMany(models.SwapDeal, {
      foreignKey: 'orderId',
      constraints: true,
    });
  };

  return Order;
};
