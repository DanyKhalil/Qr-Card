import { DataTypes } from 'sequelize';
import { sequelize } from './index.js'; // make sure your sequelize instance is exported in index.js
import { User } from './index.js';

export const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  plan_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending','active','expired','cancelled'),
    defaultValue: 'pending'
  },
  tap_charge_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'subscription',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define foreign key relation
Subscription.belongsTo(User, { foreignKey: 'user_id' });
