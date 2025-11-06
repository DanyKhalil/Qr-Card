import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProfileAnalytics = sequelize.define(
    "ProfileAnalytics",
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
        visitor_user_id: {
            type: DataTypes.CHAR(36),
            allowNull: true,
        },
        qr_scan: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        visit_date_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Profile_Analytics",
        timestamps: false,
    }
);

ProfileAnalytics.associate = function(models) {
    ProfileAnalytics.belongsTo(models.Profile, {
        foreignKey: 'profile_id',
        as: 'profile'
    });
    
    ProfileAnalytics.belongsTo(models.User, {
        foreignKey: 'visitor_user_id',
        as: 'visitor'
    });
};

export default ProfileAnalytics;