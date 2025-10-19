import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Profile = sequelize.define(
    "Profile",
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
        profile_pic_url: {
            type: DataTypes.STRING(500),
        },
        cover_pic_url: {
            type: DataTypes.STRING(500),
        },
        dob: {
            type: DataTypes.DATE,
        },
        phone_number: {
            type: DataTypes.STRING(50),
        },
        bio: {
            type: DataTypes.TEXT,
        },
        headline: {
            type: DataTypes.STRING(255),
        },
        website: {
            type: DataTypes.STRING(500),
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
        tableName: "Profile",
        timestamps: false,
    }
);

Profile.associate = function(models) {
    Profile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    Profile.hasMany(models.SocialMedia, {
        foreignKey: 'profile_id',
        as: 'social_media'
    });
    Profile.hasMany(models.Video, {
        foreignKey: 'profile_id',
        as: 'videos'
    });
    Profile.hasMany(models.Location, {
        foreignKey: 'profile_id',
        as: 'locations'
    });
};

export default Profile;