import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'visitors',
  timestamps: true
});

export default Visitor;
