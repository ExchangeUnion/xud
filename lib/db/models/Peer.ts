export default (sequelize, DataTypes) => {
  const Peer = sequelize.define('Peer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    address: { type: DataTypes.STRING(39), allowNull: false },
    port: { type: DataTypes.INTEGER, allowNull: false },
    pubKey: { type: DataTypes.STRING, allowNull: true, unique: true },
  },                            {
    tableName: 'peers',
    indexes: [{
      unique: true,
      fields: ['address', 'port'],
    }],
  });

  return Peer;
};
