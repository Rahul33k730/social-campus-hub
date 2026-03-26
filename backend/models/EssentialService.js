import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const EssentialService = sequelize.define('EssentialService', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('medical', 'hotel', 'transport'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  timing: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deliveryTime: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  isOpen: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'essential_services',
  timestamps: true
});

export default EssentialService;
