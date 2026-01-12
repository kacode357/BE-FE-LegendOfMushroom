// User model definition for PostgreSQL via Sequelize.
const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        const normalized = typeof value === "string" ? value.trim().toLowerCase() : value;
        this.setDataValue("email", normalized);
      },
      validate: {
        notEmpty: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["passwordHash"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["passwordHash"] },
      },
    },
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

module.exports = User;
