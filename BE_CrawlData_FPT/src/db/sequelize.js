// Sequelize bootstrap for PostgreSQL (AWS RDS friendly).
const { Sequelize, DataTypes } = require("sequelize");

function buildSequelizeOptionsFromEnv() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl && String(databaseUrl).trim()) {
    const sslEnabled = String(process.env.DB_SSL || "").toLowerCase() === "true";
    return {
      databaseUrl,
      options: {
        dialect: "postgres",
        logging: false,
        dialectOptions: sslEnabled
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : undefined,
      },
    };
  }

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;
  const database = process.env.DB_NAME;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !database || !username) {
    throw new Error(
      "Database config missing. Set DATABASE_URL or DB_HOST, DB_NAME, DB_USER, DB_PASSWORD"
    );
  }

  const sslEnabled = String(process.env.DB_SSL || "").toLowerCase() === "true";

  return {
    databaseUrl: null,
    options: {
      dialect: "postgres",
      host,
      port,
      database,
      username,
      password,
      logging: false,
      dialectOptions: sslEnabled
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined,
    },
  };
}

let sequelize;

function getSequelize() {
  if (sequelize) return sequelize;

  const { databaseUrl, options } = buildSequelizeOptionsFromEnv();
  sequelize = databaseUrl ? new Sequelize(databaseUrl, options) : new Sequelize(options);

  return sequelize;
}

module.exports = {
  Sequelize,
  DataTypes,
  getSequelize,
};
