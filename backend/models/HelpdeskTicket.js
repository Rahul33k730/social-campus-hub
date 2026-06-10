import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HelpdeskTicket = sequelize.define('HelpdeskTicket', {
  ticket_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Technical', 'Academic', 'Facilities', 'Printing', 'Other'),
    defaultValue: 'Other'
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'open'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'helpdesk_tickets',
  timestamps: true
});

export default HelpdeskTicket;
