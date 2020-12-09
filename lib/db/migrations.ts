import Sequelize, { DataTypes } from 'sequelize';

/**
 * An ordered array of functions that will migrate the database from one
 * version to the next. The 1st element (index 0) will migrate from version
 * 0 to 1, the 2nd element will migrate from version 1 to 2, and so on...
 * Each migration must be called in order and allowed to complete before
 * calling the next.
 */
const migrations: ((sequelize: Sequelize.Sequelize) => Promise<void>)[] = [];

migrations[0] = async (sequelize: Sequelize.Sequelize) => {
  await sequelize.getQueryInterface().createTable('passwords', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    encryptedPassword: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING(5), allowNull: true },
    swapClient: { type: DataTypes.TINYINT, allowNull: false },
    createdAt: { type: DataTypes.BIGINT, allowNull: false },
  });
};

migrations[1] = async (sequelize: Sequelize.Sequelize) => {
  await sequelize
    .getQueryInterface()
    .addColumn('nodes', 'consecutiveConnFailures', { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 });
};

export default migrations;
