import Sequelize from 'sequelize';
import * as db from '../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.CurrencyAttributes> = {
    id: { type: DataTypes.STRING(5), primaryKey: true },
    tokenAddress: { type: DataTypes.STRING, allowNull: true },
    decimalPlaces: { type: DataTypes.TINYINT, allowNull: false },
    swapClient: { type: DataTypes.TINYINT, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.CurrencyInstance> = {
    tableName: 'currencies',
    timestamps: false,
  };

  const Currency = sequelize.define<db.CurrencyInstance, db.CurrencyAttributes>('Currency', attributes, options);

  Currency.associate = (models: Sequelize.Models) => {
    models.Currency.hasMany(models.Pair, {
      as: 'quoteCurrencies',
      foreignKey: 'quoteCurrency',
      constraints: true,
    });
    models.Currency.hasMany(models.Pair, {
      as: 'baseCurrencies',
      foreignKey: 'baseCurrency',
      constraints: true,
    });
  };

  return Currency;
};
