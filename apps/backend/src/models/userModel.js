import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// ---- Here we are creating a user model, to represent the user table in the database ----

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "user",
    },
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "User", // because table alreadu exists, we must give its tru name in the databasre
    timestamps: false, // we already manage timestamps manually in SQL
  }
);

User.associate = function(models) {
  User.hasOne(models.Profile, {
    foreignKey: 'user_id',
    as: 'profile'
  });

  User.hasMany(models.ProfileAnalytics, {
    foreignKey: 'visitor_user_id',
    as: 'profile_visits_made'
  });

  User.hasMany(models.Payment, {
    foreignKey: "approved_by",
    as: "approved_payments",
  });
};

export default User;
