import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { ReputationEventInstance } from '../types';

export default function ReputationEvent(sequelize: Sequelize) {
  const attributes: ModelAttributes<ReputationEventInstance> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event: { type: DataTypes.INTEGER, allowNull: false },
    nodeId: { type: DataTypes.INTEGER, allowNull: false },
  };

  const options: ModelOptions = {
    tableName: 'reputationEvents',
    timestamps: true,
    updatedAt: false,
  };

  return sequelize.define<ReputationEventInstance>('ReputationEvent', attributes, options);
}
