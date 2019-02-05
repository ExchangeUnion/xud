import Sequelize from 'sequelize';
import * as db from '../types';
import { derivePairId } from '../../utils/utils';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.PairAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
    baseCurrency: { type: DataTypes.STRING, allowNull: false },
    quoteCurrency: { type: DataTypes.STRING, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.PairInstance> = {
    tableName: 'pairs',
    timestamps: false,
  };

  const Pair = sequelize.define<db.PairInstance, db.PairAttributes>('Pair', attributes, options);

  Pair.associate = (models: Sequelize.Models) => {
    models.Pair.belongsTo(models.Currency, {
      as: 'baseCurrencyInstance',
      constraints: true,
      foreignKey: 'baseCurrency',
    });

    models.Pair.belongsTo(models.Currency, {
      as: 'takerCurrencyInstance',
      constraints: true,
      foreignKey: 'quoteCurrency',
    });

    models.Pair.beforeBulkCreate(pairs => pairs.forEach(pair => pair.id = derivePairId(pair)));
    models.Pair.beforeCreate(pair => pair.id = derivePairId(pair));
  };

  return Pair;
};
