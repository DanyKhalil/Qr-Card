import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SubscriptionPlan = sequelize.define(
  "SubscriptionPlan",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    billing_interval: {
      type: DataTypes.ENUM("monthly", "yearly"),
      defaultValue: "monthly",
    },
    max_profiles: {
      type: DataTypes.INTEGER,
    },
    max_custom_content: {
      type: DataTypes.INTEGER,
    },
    analytics_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    qr_customization: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Subscription_Plan",
    timestamps: false,
  }
);

SubscriptionPlan.associate = (models) => {
  SubscriptionPlan.hasMany(models.UserSubscription, {
    foreignKey: "plan_id",
    as: "subscriptions",
  });
};

export default SubscriptionPlan;
