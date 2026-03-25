import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Faculty = sequelize.define('Faculty', {
  faculty_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  department: {
    type: DataTypes.ENUM('CSE', 'CSBS'),
    allowNull: false
  }
}, {
  tableName: 'faculty',
  timestamps: false
});

Faculty.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Faculty, { foreignKey: 'user_id' });

export default Faculty;
