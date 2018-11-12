import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.TradeAttributes> = {
    makerOrderId: { type: DataTypes.STRING, primaryKey: true },
    takerOrderId: { type: DataTypes.STRING, primaryKey: true },
    quantity: { type: DataTypes.DECIMAL(8), allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.TradeInstance>  = {
    tableName: 'trades',
    timestamps: true,
    updatedAt: false,
  };

  const Trade = sequelize.define<db.TradeInstance, db.TradeAttributes>('Trade', attributes, options);

  Trade.associate = (models: Sequelize.Models) => {
    models.Trade.belongsTo(models.Order, {
      as: 'makerOrder',
      foreignKey: 'makerOrderId',
      constraints: true,
    });
    models.Trade.belongsTo(models.Order, {
      as: 'takerOrder',
      foreignKey: 'takerOrderId',
      constraints: true,
    });
  };

  return Trade;
};
