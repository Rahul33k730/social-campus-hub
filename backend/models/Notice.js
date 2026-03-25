import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Notice = sequelize.define('Notice', {
  notice_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('exam', 'assignment', 'event', 'admin'),
    allowNull: false
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  target_branch: {
    type: DataTypes.ENUM('CSE', 'CSBS'),
    allowNull: true
  },
  target_club: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_emergency: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notices',
  timestamps: false
});

Notice.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
User.hasMany(Notice, { foreignKey: 'created_by' });

export default Notice;
