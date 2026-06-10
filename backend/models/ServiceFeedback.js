import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ServiceFeedback = sequelize.define('ServiceFeedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  service_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'service_feedbacks',
  timestamps: true
});

export default ServiceFeedback;
