import Sequelize from 'sequelize';
import { db } from '../../types';
import { SwapProtocol } from '../../types/enums';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.PairAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
    baseCurrency: { type: DataTypes.STRING, allowNull: false },
    quoteCurrency: { type: DataTypes.STRING, allowNull: false },
    swapProtocol: {
      type: DataTypes.ENUM, values: Object.values(SwapProtocol), allowNull: false,
    },
  };

  const options: Sequelize.DefineOptions<db.PairInstance> = {
    tableName: 'pairs',
    timestamps: false,
  };

  const Pair = sequelize.define<db.PairInstance, db.PairAttributes>('Pair', attributes, options);

  Pair.associate = (models: Sequelize.Models) => {
    models.Pair.belongsTo(models.Currency, {
      foreignKey: 'baseCurrency',
    });

    models.Pair.belongsTo(models.Currency, {
      foreignKey: 'quoteCurrency',
    });

    const derivePairId = (pair: db.PairInstance) => {
      pair.id = `${pair.baseCurrency}/${pair.quoteCurrency}`;
    };
    models.Pair.beforeBulkCreate(pairs => pairs.forEach(pair => derivePairId(pair)));
    models.Pair.beforeCreate(pair => derivePairId(pair));
  };

  return Pair;
};
