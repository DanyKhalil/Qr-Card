import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SocialMedia = sequelize.define(
    "SocialMedia",
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
        url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        display_order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        tableName: "Social_Media",
        timestamps: false,
    }
);

export default SocialMedia;