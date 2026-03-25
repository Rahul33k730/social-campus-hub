import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Student = sequelize.define('Student', {
  student_id: {
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
  student_code: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  attendance_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  }
}, {
  tableName: 'students',
  timestamps: false
});

Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Student, { foreignKey: 'user_id' });

export default Student;
