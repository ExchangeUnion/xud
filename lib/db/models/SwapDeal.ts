import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.SwapDealAttributes> = {
    role: { type: DataTypes.TINYINT, allowNull: false },
    state: { type: DataTypes.TINYINT, allowNull: false },
    phase: { type: DataTypes.TINYINT, allowNull: false },
    errorReason: { type: DataTypes.STRING, allowNull: true },
    r_hash: { type: DataTypes.STRING, allowNull: false, unique: true },
    r_preimage: { type: DataTypes.STRING, allowNull: true },
    peerPubKey: { type: DataTypes.STRING, allowNull: false },
    orderId: { type: DataTypes.STRING, allowNull: false },
    localId: { type: DataTypes.STRING, allowNull: false },
    proposedQuantity: { type: DataTypes.DECIMAL(8), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(8), allowNull: true },
    pairId: { type: DataTypes.STRING, allowNull: false },
    takerAmount: { type: DataTypes.NUMBER , allowNull: false },
    takerCurrency: { type: DataTypes.STRING , allowNull: false },
    takerPubKey: { type: DataTypes.STRING , allowNull: true },
    price: { type: DataTypes.DECIMAL(8), allowNull: false },
    takerCltvDelta: { type: DataTypes.NUMBER, allowNull: false },
    makerCltvDelta: { type: DataTypes.NUMBER, allowNull: true },
    makerAmount: { type: DataTypes.NUMBER, allowNull: false },
    makerCurrency: { type: DataTypes.STRING, allowNull: false },
    createTime: { type: DataTypes.BIGINT, allowNull: false },
    executeTime: { type: DataTypes.BIGINT, allowNull: true },
    completeTime: { type: DataTypes.BIGINT, allowNull: true },
  };

  const options: Sequelize.DefineOptions<db.SwapDealInstance>  = {
    tableName: 'swapdeals',
    timestamps: false,
  };

  const SwapDeal = sequelize.define<db.SwapDealInstance, db.SwapDealAttributes>('SwapDeal', attributes, options);

  return SwapDeal;
};
