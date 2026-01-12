const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    packageId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    // Admin user id (jwt sub) who created it.
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["packageId"] },
      { fields: ["createdAt"] },
    ],
  }
);

module.exports = Notification;
