import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Admin = sequelize.define('Admin', {
  admin_id: {
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
  tableName: 'admins',
  timestamps: false
});

Admin.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Admin, { foreignKey: 'user_id' });

export default Admin;
