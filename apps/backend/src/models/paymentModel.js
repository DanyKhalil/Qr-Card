import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define(
  "Payment",
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
    subscription_id: {
      type: DataTypes.CHAR(36),
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
    },
    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "completed",
        "failed",
        "refunded"
      ),
      defaultValue: "pending",
    },
    transaction_reference: {
      type: DataTypes.STRING(255),
    },
    paid_at: {
      type: DataTypes.DATE,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    approved_by: {
      type: DataTypes.CHAR(36),
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
    tableName: "Payment",
    timestamps: false,
  }
);

Payment.associate = (models) => {
  Payment.belongsTo(models.User, {
    foreignKey: "user_id",
    as: "user",
  });

  Payment.belongsTo(models.UserSubscription, {
    foreignKey: "subscription_id",
    as: "subscription",
  });

  Payment.belongsTo(models.User, {
    foreignKey: "approved_by",
    as: "approved_by_admin",
  });
};

export default Payment;
