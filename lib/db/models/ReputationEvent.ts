import Sequelize from 'sequelize';
import * as db from '../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.ReputationEventAttributes> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    event: { type: DataTypes.INTEGER, allowNull: false },
    nodeId: { type: DataTypes.INTEGER, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.ReputationEventInstance> = {
    tableName: 'reputationEvents',
    timestamps: true,
    updatedAt: false,
  };

  const ReputationEvent = sequelize.define<db.ReputationEventInstance, db.ReputationEventAttributes>('ReputationEvent', attributes, options);

  ReputationEvent.associate = (models: Sequelize.Models) => {
    models.ReputationEvent.belongsTo(models.Node, {
      foreignKey: 'nodeId',
      constraints: true,
    });
  };

  return ReputationEvent;
};
