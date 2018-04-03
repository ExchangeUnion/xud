module.exports = (sequelize, DataTypes) => {
  const Peer = sequelize.define('Peer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nodeKey: { type: DataTypes.STRING, unique: true },
    ipv4: DataTypes.STRING(15),
    port: DataTypes.SMALLINT,
  }, {
    tableName: 'peers',
  });

  return Peer;
};
