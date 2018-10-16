import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.SwapDealAttributes> = {
    myRole: { type: DataTypes.TINYINT, allowNull: false },
    state: { type: DataTypes.TINYINT, allowNull: false },
    stateReason: { type: DataTypes.STRING, allowNull: false },
    peerPubKey: { type: DataTypes.STRING, allowNull: false },
    orderId: { type: DataTypes.STRING, allowNull: false },
    localOrderId: { type: DataTypes.STRING, allowNull: false },
    proposedQuantity: { type: DataTypes.NUMBER, allowNull: false },
    quantity: { type: DataTypes.NUMBER, allowNull: true },
    pairId: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.NUMBER, allowNull: false },
    takerAmount : { type: DataTypes.INTEGER, allowNull: false },
    makerAmount: { type: DataTypes.INTEGER, allowNull: false },
    takerCltvDelta: { type: DataTypes.NUMBER, allowNull: false },
    makerCltvDelta: { type: DataTypes.NUMBER, allowNull: true },
    r_hash: { type: DataTypes.STRING, allowNull: false },
    r_preimage: { type: DataTypes.STRING, allowNull: true },
    createTime: { type: DataTypes.NUMBER, allowNull: false },
    executeTime: { type: DataTypes.NUMBER, allowNull: true },
    completionTime: { type: DataTypes.NUMBER, allowNull: true },
  };

  const options: Sequelize.DefineOptions<db.SwapDealInstance>  = {
    tableName: 'swapdeals',
    timestamps: false,
  };

  const SwapDeal = sequelize.define<db.SwapDealInstance, db.SwapDealAttributes>('SwapDeal', attributes, options);

  return SwapDeal;
};
