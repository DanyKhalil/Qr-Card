import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CustomContentItem = sequelize.define(
    "CustomContentItem",
    {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        content_type_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        profile_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
        },
        visibility: {
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
        }
    },
    {
        tableName: "Custom_Content_Item",
        timestamps: false,
    }
);

CustomContentItem.associate = function(models) {
    CustomContentItem.belongsTo(models.CustomContentType, {
        foreignKey: "content_type_id",
        as: "contentType"
    });

    CustomContentItem.belongsTo(models.Profile, {
        foreignKey: "profile_id",
        as: "profile"
    });

    CustomContentItem.hasMany(models.CustomContentValue, {
        foreignKey: "content_item_id",
        as: "values"
    });
};

export default CustomContentItem;
