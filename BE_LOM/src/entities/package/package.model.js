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
    nameEn: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    price: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Miễn Phí",
    },
    priceEn: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Free",
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    featuresEn: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    fileUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },
    gradient: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "from-blue-500 via-blue-400 to-cyan-500",
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Hidden from public API (users won't see this package)
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
