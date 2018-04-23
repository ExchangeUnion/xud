module.exports = (sequelize, DataTypes) => {
  const Currency = sequelize.define('Currency', {
    id: { type: DataTypes.STRING, primaryKey: true },
  },                                {
    tableName: 'currencies',
  });

  return Currency;
};
