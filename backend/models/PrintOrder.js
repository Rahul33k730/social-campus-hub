import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const PrintOrder = sequelize.define('PrintOrder', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  file_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  copies: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  color_type: {
    type: DataTypes.ENUM('BW', 'Color'),
    defaultValue: 'BW'
  },
  pages: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  price: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'printing', 'completed'),
    defaultValue: 'pending'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  }
}, {
  tableName: 'print_orders',
  timestamps: true
});

PrintOrder.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default PrintOrder;
