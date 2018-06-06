import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.CurrencyAttributes> = {
    id: { type: DataTypes.STRING, primaryKey: true },
  };

  const options: Sequelize.DefineOptions<db.CurrencyInstance> = {
    tableName: 'currencies',
    timestamps: false,
  };

  const Currency = sequelize.define<db.CurrencyInstance, db.CurrencyAttributes>('Currency', attributes, options);

  return Currency;
};
