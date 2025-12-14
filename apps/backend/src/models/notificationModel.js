import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    action_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    action_label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    seen_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Notification",
    timestamps: false,
  }
);

// Add associations later if needed
Notification.associate = function(models) {
  Notification.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  Notification.belongsTo(models.User, {
    foreignKey: 'sender_id',
    as: 'sender'
  });
};

export default Notification;