const { getSequelize, DataTypes } = require("../../db/sequelize");

const sequelize = getSequelize();

const Contact = sequelize.define(
  "Contact",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // Member who submitted the contact
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Status: pending, processing, resolved, closed
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
    },
    // Admin note (internal)
    adminNote: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    // Admin reply (visible to user)
    adminReply: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    repliedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    // Admin who handled this contact
    handledBy: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    handledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "contacts",
    timestamps: true,
    indexes: [
      { fields: ["status"] },
      { fields: ["createdAt"] },
      { fields: ["email"] },
      { fields: ["memberId"] },
    ],
  }
);

module.exports = Contact;
