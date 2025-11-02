import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Location = sequelize.define(
    "Location",
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
        country: {
            type: DataTypes.STRING(100),
        },
        state: {
            type: DataTypes.STRING(100),
        },
        city: {
            type: DataTypes.STRING(100),
        },
        street: {
            type: DataTypes.STRING(255),
        },
        building: {
            type: DataTypes.STRING(100),
        },
        floor: {
            type: DataTypes.STRING(50),
        },
        maps_url: {
            type: DataTypes.STRING(500),
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        tableName: "Location",
        timestamps: false,
    }
);

export default Location;