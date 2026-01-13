const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const Member = sequelize.define(
  "Member",
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
        isEmail: true,
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
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifyToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    verifyTokenExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "members",
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ["passwordHash", "verifyToken", "resetPasswordToken"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["passwordHash"] },
      },
      withTokens: {
        attributes: { include: ["verifyToken", "resetPasswordToken", "verifyTokenExpires", "resetPasswordExpires"] },
      },
    },
    indexes: [
      { unique: true, fields: ["email"] },
      { fields: ["verifyToken"] },
      { fields: ["resetPasswordToken"] },
    ],
  }
);

module.exports = Member;
