import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { TradeInstance } from '../types';

export default function ReputationEvent(sequelize: Sequelize) {
  const attributes: ModelAttributes<TradeInstance> = {
    makerOrderId: { type: DataTypes.STRING, allowNull: false },
    takerOrderId: { type: DataTypes.STRING, allowNull: true },
    rHash: { type: DataTypes.STRING, allowNull: true },
    quantity: { type: DataTypes.BIGINT, allowNull: false },
    createdAt: { type: DataTypes.DATE },
  };

  const options: ModelOptions = {
    tableName: 'trades',
    timestamps: true,
    updatedAt: false,
  };

  return sequelize.define<TradeInstance>('Trade', attributes, options);
}
