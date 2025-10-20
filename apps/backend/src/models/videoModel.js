import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Video = sequelize.define(
    "Video",
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
        video_url: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
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
        tableName: "Video",
        timestamps: false,
    }
);

export default Video;