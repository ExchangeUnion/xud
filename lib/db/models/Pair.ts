import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { PairInstance } from '../types';

export default function Pair(sequelize: Sequelize) {
  const attributes: ModelAttributes<PairInstance> = {
    id: { type: DataTypes.STRING, primaryKey: true },
    baseCurrency: { type: DataTypes.STRING, allowNull: false },
    quoteCurrency: { type: DataTypes.STRING, allowNull: false },
  };

  const options: ModelOptions = {
    tableName: 'pairs',
    timestamps: false,
  };

  return sequelize.define<PairInstance>('Pair', attributes, options);
}
