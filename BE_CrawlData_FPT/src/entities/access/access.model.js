const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const AccessCode = sequelize.define(
  "AccessCode",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Only used for "registration window". Set to NULL once the code is claimed.
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    lastAccessAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },

    userUid: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    userName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    userServer: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    userAvatarUrl: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },

    packageId: { type: DataTypes.UUID, allowNull: true, defaultValue: null },
    // Snapshot to keep list/users stable even if package is edited/deleted.
    packageName: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },

    createdBy: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  },
  {
    tableName: "access_codes",
    timestamps: true,
    indexes: [
      { unique: true, fields: ["code"] },
      { fields: ["expiresAt"] },
      { fields: ["usedAt"] },
    ],
  }
);

module.exports = AccessCode;
