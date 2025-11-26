import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CustomContentValue = sequelize.define(
    "CustomContentValue",
    {
        id: {
            type: DataTypes.CHAR(36),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        content_item_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        content_field_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
        },
        value_text: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        value_json: {
            type: DataTypes.JSON,
            allowNull: true,
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
        tableName: "Custom_Content_Value",
        timestamps: false,
    }
);

CustomContentValue.associate = function(models) {
    CustomContentValue.belongsTo(models.CustomContentItem, {
        foreignKey: "content_item_id",
        as: "item"
    });

    CustomContentValue.belongsTo(models.CustomContentField, {
        foreignKey: "content_field_id",
        as: "field"
    });
};

export default CustomContentValue;
