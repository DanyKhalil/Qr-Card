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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        profile_pic_url: {
            type: DataTypes.STRING(500),
        },
        cover_pic_url: {
            type: DataTypes.STRING(500),
        },
        qr_code_color: {
            type: DataTypes.STRING(7),
            defaultValue: '#000000',
        },
        qr_code_include_profile_pic: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        qr_code_include_contact: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        qr_code_include_social: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        qr_code_include_website: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
    Profile.hasMany(models.ProfileAnalytics, {
        foreignKey: 'visitor_profile_id',
        as: 'profile_visits_made'
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

    Profile.hasMany(models.UserSubscription, {
        foreignKey: 'profile_id',
        as: 'subscriptions'
    });

    // Notifications received by this profile
    Profile.hasMany(models.Notification, {
        foreignKey: "receiver_profile_id",
        as: "notifications"
    });

    // Notifications sent by this profile
    Profile.hasMany(models.Notification, {
        foreignKey: "sender_profile_id",
        as: "sent_notifications"
    });

};

export default Profile;