import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CustomContentType = sequelize.define(
    "CustomContentType",
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
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        tableName: "Custom_Content_Type",
        timestamps: false,
    }
);

CustomContentType.associate = function(models) {
    CustomContentType.belongsTo(models.Profile, {
        foreignKey: "profile_id",
        as: "profile"
    });

    CustomContentType.hasMany(models.CustomContentField, {
        foreignKey: "content_type_id",
        as: "fields"
    });

    CustomContentType.hasMany(models.CustomContentItem, {
        foreignKey: "content_type_id",
        as: "items"
    });
};

export default CustomContentType;
