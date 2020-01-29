import Sequelize from 'sequelize';

/**
 * An ordered array of functions that will migrate the database from one
 * version to the next. The 1st element (index 0) will migrate from version
 * 0 to 1, the 2nd element will migrate from version 1 to 2, and so on...
 * Each migration must be called in order and allowed to complete before
 * calling the next.
 */
const migrations: ((sequelize: Sequelize.Sequelize) => Promise<void>)[] = [];


export default migrations;
