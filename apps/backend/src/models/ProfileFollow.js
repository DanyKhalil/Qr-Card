import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ProfileFollow = sequelize.define(
    "ProfileFollow",
    {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        follower_profile_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        following_profile_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "Profile_Follow",
        timestamps: false,
        indexes: [
            { fields: ["follower_profile_id"] },
            { fields: ["following_profile_id"] },
            {
                unique: true,
                fields: ["follower_profile_id", "following_profile_id"],
            },
        ],
    }
);

ProfileFollow.associate = function(models) {
    // Profile who FOLLOWED another
    ProfileFollow.belongsTo(models.Profile, {
        foreignKey: "follower_profile_id",
        as: "follower",
        onDelete: "CASCADE",
    });

    // Profile who IS FOLLOWED by another
    ProfileFollow.belongsTo(models.Profile, {
        foreignKey: "following_profile_id",
        as: "following",
        onDelete: "CASCADE",
    });
};

export default ProfileFollow;
