const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const Package = sequelize.define(
  "Package",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    fileUrl: {
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
    tableName: "packages",
    timestamps: true,
    indexes: [{ unique: true, fields: ["name"] }],
  }
);

module.exports = Package;
