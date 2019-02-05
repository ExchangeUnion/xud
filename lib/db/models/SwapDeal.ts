import Sequelize from 'sequelize';
import * as db from '../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.SwapDealAttributes> = {
    rHash: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.TINYINT, allowNull: false },
    state: { type: DataTypes.TINYINT, allowNull: false },
    phase: { type: DataTypes.TINYINT, allowNull: false },
    failureReason: { type: DataTypes.TINYINT, allowNull: true },
    errorMessage: { type: DataTypes.STRING, allowNull: true },
    rPreimage: { type: DataTypes.STRING, allowNull: true },
    peerPubKey: {
      type: DataTypes.VIRTUAL,
      get(this: db.SwapDealInstance) {
        return this.Node ? this.Node.nodePubKey : undefined;
      },
    },
    nodeId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.STRING, allowNull: false },
    localId: { type: DataTypes.STRING, allowNull: false },
    proposedQuantity: { type: DataTypes.DECIMAL(8), allowNull: false },
    quantity: { type: DataTypes.DECIMAL(8), allowNull: true },
    takerAmount: { type: DataTypes.BIGINT , allowNull: false },
    takerCurrency: { type: DataTypes.STRING , allowNull: false },
    takerPubKey: { type: DataTypes.STRING , allowNull: true },
    takerCltvDelta: { type: DataTypes.SMALLINT, allowNull: false },
    makerCltvDelta: { type: DataTypes.SMALLINT, allowNull: true },
    makerAmount: { type: DataTypes.BIGINT, allowNull: false },
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

  SwapDeal.associate = (models: Sequelize.Models) => {
    models.SwapDeal.belongsTo(models.Order, {
      foreignKey: 'orderId',
      constraints: true,
    });
    models.SwapDeal.belongsTo(models.Node, {
      foreignKey: 'nodeId',
      constraints: true,
    });
  };

  return SwapDeal;
};
