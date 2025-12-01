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

    Profile.hasMany(models.ProfileAnalytics, {
        foreignKey: 'profile_id',
        as: 'analytics'
    });


    // Profiles *following* other profiles
    Profile.hasMany(models.ProfileFollow, {
        foreignKey: "follower_profile_id",
        as: "following"
    });

    // Profiles *being followed* by others
    Profile.hasMany(models.ProfileFollow, {
        foreignKey: "following_profile_id",
        as: "followers"
    });
    Profile.hasMany(models.CustomContentType, {
        foreignKey: "profile_id",
        as: "custom_types"
    });

    Profile.hasMany(models.CustomContentItem, {
        foreignKey: "profile_id",
        as: "custom_items"
    });
};

export default Profile;
