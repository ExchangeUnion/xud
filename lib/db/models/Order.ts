module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, primaryKey: true },
    pairId: { type: DataTypes.STRING, allowNull: false },
    peerId: { type: DataTypes.INTEGER, allowNull: true },
    quantity: DataTypes.DECIMAL(14, 8),
    price: DataTypes.DECIMAL(14, 8),
    createdAt: DataTypes.DATE,
  },                             {
    tableName: 'orders',
    timestamps: false,
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

