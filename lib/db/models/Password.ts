import { DataTypes, ModelAttributes, ModelOptions, Sequelize } from 'sequelize';
import { PasswordInstance } from '../types';

export default function Password(sequelize: Sequelize) {
  const attributes: ModelAttributes<PasswordInstance> = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    encryptedPassword: { type: DataTypes.STRING, allowNull: false },
    currency: { type: DataTypes.STRING(5), allowNull: true },
    swapClient: { type: DataTypes.TINYINT, allowNull: false },
    createdAt: { type: DataTypes.BIGINT, allowNull: false },
  };

  const options: ModelOptions = {
    tableName: 'passwords',
    timestamps: true,
    updatedAt: false,
  };

  return sequelize.define<PasswordInstance>('Password', attributes, options);
}
