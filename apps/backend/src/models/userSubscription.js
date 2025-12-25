import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserSubscription = sequelize.define(
  "UserSubscription",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    profile_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    plan_id: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "active",
        "expired",
        "cancelled",
        "suspended"
      ),
      defaultValue: "pending",
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    next_billing_date: {
      type: DataTypes.DATE,
    },
    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
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
    tableName: "User_Subscription",
    timestamps: false,
  }
);

UserSubscription.associate = (models) => {
  UserSubscription.belongsTo(models.Profile, {
    foreignKey: "profile_id",
    as: "profile",
  });

  UserSubscription.belongsTo(models.SubscriptionPlan, {
    foreignKey: "plan_id",
    as: "plan",
  });

  UserSubscription.hasMany(models.Payment, {
    foreignKey: "subscription_id",
    as: "payments",
  });
};

export default UserSubscription;
