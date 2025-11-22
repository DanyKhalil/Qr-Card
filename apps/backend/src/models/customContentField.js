import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CustomContentField = sequelize.define(
    "CustomContentField",
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
        field_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING(255),
        },
        field_key: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        field_type: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        config: {
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
        tableName: "Custom_Content_Field",
        timestamps: false,
    }
);

CustomContentField.associate = function(models) {
    CustomContentField.belongsTo(models.CustomContentType, {
        foreignKey: "content_type_id",
        as: "contentType"
    });

    CustomContentField.hasMany(models.CustomContentValue, {
        foreignKey: "content_field_id",
        as: "values"
    });
};

export default CustomContentField;
