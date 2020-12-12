import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { SwapDealInstance } from '../types';

export default function ReputationEvent(sequelize: Sequelize) {
  const attributes: ModelAttributes<SwapDealInstance> = {
    rHash: { type: DataTypes.STRING, primaryKey: true },
    role: { type: DataTypes.TINYINT, allowNull: false },
    state: { type: DataTypes.TINYINT, allowNull: false },
    phase: { type: DataTypes.TINYINT, allowNull: false },
    failureReason: { type: DataTypes.TINYINT, allowNull: true },
    errorMessage: { type: DataTypes.STRING, allowNull: true },
    rPreimage: { type: DataTypes.STRING, allowNull: true },
    peerPubKey: {
      type: DataTypes.VIRTUAL,
      get(this: SwapDealInstance) {
        return this.Node ? this.Node.nodePubKey : undefined;
      },
    },
    nodeId: { type: DataTypes.INTEGER, allowNull: false },
    orderId: { type: DataTypes.STRING, allowNull: false },
    localId: { type: DataTypes.STRING, allowNull: false },
    proposedQuantity: { type: DataTypes.BIGINT, allowNull: false },
    quantity: { type: DataTypes.BIGINT, allowNull: true },
    takerAmount: { type: DataTypes.BIGINT, allowNull: false },
    takerCurrency: { type: DataTypes.STRING, allowNull: false },
    takerPubKey: { type: DataTypes.STRING, allowNull: true },
    takerCltvDelta: { type: DataTypes.SMALLINT, allowNull: false },
    makerCltvDelta: { type: DataTypes.SMALLINT, allowNull: true },
    makerAmount: { type: DataTypes.BIGINT, allowNull: false },
    makerCurrency: { type: DataTypes.STRING, allowNull: false },
    createTime: { type: DataTypes.BIGINT, allowNull: false },
    executeTime: { type: DataTypes.BIGINT, allowNull: true },
    completeTime: { type: DataTypes.BIGINT, allowNull: true },
  };

  const options: ModelOptions = {
    tableName: 'swapdeals',
    timestamps: false,
  };

  return sequelize.define<SwapDealInstance>('SwapDeal', attributes, options);
}
