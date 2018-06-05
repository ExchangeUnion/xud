import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.OrderAttributes> = {
    id: { type: DataTypes.UUID, primaryKey: true },
    pairId: { type: DataTypes.STRING, allowNull: false },
    hostId: { type: DataTypes.INTEGER, allowNull: true },
    quantity: DataTypes.DECIMAL(14, 8),
    price: DataTypes.DECIMAL(14, 8),
    createdAt: DataTypes.DATE,
  };

  const options: Sequelize.DefineOptions<db.OrderInstance> = {
    tableName: 'orders',
    timestamps: false,
  };

  const Order = sequelize.define<db.OrderInstance, db.OrderAttributes>('Order', attributes, options);

  Order.associate = (models: Sequelize.Models) => {
    models.Order.belongsTo(models.Pair, {
      foreignKey: 'pairId',
    });
    models.Order.belongsTo(models.Host, {
      foreignKey: 'hostId',
    });
  };

  return Order;
};
