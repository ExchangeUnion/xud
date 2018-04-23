import enums from'../../constants/enums';

export default (sequelize, DataTypes) => {
  const Pair = sequelize.define('Pair', {
    id: { type: DataTypes.STRING, primaryKey: true },
    baseCurrency: { type: DataTypes.STRING, allowNull: false },
    quoteCurrency: { type: DataTypes.STRING, allowNull: false },
    swapProtocol: {
      type: DataTypes.ENUM, values: Object.values(enums.swapProtocols), allowNull: true,
    },
  }, { // tslint:disable align
    tableName: 'pairs',
  });

  Pair.defineAssociations = (models) => {
    models.Pair.belongsTo(models.Currency, {
      foreignKey: 'baseCurrency',
    });

    models.Pair.belongsTo(models.Currency, {
      foreignKey: 'quoteCurrency',
    });

    const derivePairId = (pair) => {
      pair.id =
          `${pair.baseCurrency}/${pair.quoteCurrency}`;
    };
    models.Pair.beforeBulkCreate(pairs => pairs.forEach(pair => derivePairId(pair)));
    models.Pair.beforeCreate(pair => derivePairId(pair));
  };

  return Pair;
};

