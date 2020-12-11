import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { CurrencyInstance } from '../types';

export default function Currency(sequelize: Sequelize) {
  const attributes: ModelAttributes<CurrencyInstance> = {
    id: { type: DataTypes.STRING(5), primaryKey: true },
    tokenAddress: { type: DataTypes.STRING, allowNull: true },
    decimalPlaces: { type: DataTypes.TINYINT, allowNull: false },
    swapClient: { type: DataTypes.TINYINT, allowNull: false },
  };

  const options: ModelOptions = {
    tableName: 'currencies',
    timestamps: false,
  };

  return sequelize.define<CurrencyInstance>('Currency', attributes, options);
}
