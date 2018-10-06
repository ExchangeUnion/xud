import Sequelize from 'sequelize';
import { db } from '../../types';

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  const attributes: db.SequelizeAttributes<db.SwapDealAttributes> = {
    myRole: { type: DataTypes.TINYINT, allowNull: false },
    state: { type: DataTypes.TINYINT, allowNull: false },
    peerPubKey: { type: DataTypes.STRING, allowNull: false },
    takerAmount : { type: DataTypes.INTEGER, allowNull: false },
    takerCurrency : { type: DataTypes.STRING, allowNull: false },
    makerAmount: { type: DataTypes.INTEGER, allowNull: false },
    makerCurrency: { type: DataTypes.STRING, allowNull: false },
    r_hash: { type: DataTypes.STRING, allowNull: false },
  };

  const options: Sequelize.DefineOptions<db.SwapDealInstance>  = {
    tableName: 'swapdeals',
    timestamps: false,
  };

  const SwapDeal = sequelize.define<db.SwapDealInstance, db.SwapDealAttributes>('SwapDeal', attributes, options);

  return SwapDeal;
};
