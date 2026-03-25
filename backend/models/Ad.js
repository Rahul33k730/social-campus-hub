import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Ad = sequelize.define('Ad', {
  ad_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false
  },
  content_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'ads',
  timestamps: true
});

export default Ad;
