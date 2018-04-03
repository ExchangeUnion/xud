module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pairId: { type: DataTypes.STRING, allowNull: false },
    peerId: { type: DataTypes.INTEGER, allowNull: true },
    quantity: DataTypes.DECIMAL(14, 8),
    price: DataTypes.DECIMAL(14, 8),
  }, {
    tableName: 'orders',
  });

  Order.defineAssociations = (models) => {
    models.Order.belongsTo(models.Pair, {
      foreignKey: 'pairId',
    });
    models.Order.belongsTo(models.Peer, {
      foreignKey: 'peerId',
    });
  };

  return Order;
};

