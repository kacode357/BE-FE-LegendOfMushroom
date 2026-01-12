// Database initialization: connect, sync schema, optional reset.
const { getSequelize } = require("./sequelize");

function shouldResetDatabaseOnStart() {
  const raw = String(process.env.DB_RESET_ON_START || "").trim().toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return process.env.NODE_ENV !== "production";
}

async function initDatabase() {
  const sequelize = getSequelize();

  // Ensure models are registered.
  require("../entities/user/user.model");
  require("../entities/package/package.model");
  require("../entities/access/access.model");

  await sequelize.authenticate();

  if (shouldResetDatabaseOnStart()) {
    console.log("Resetting database on start...");
    await sequelize.drop();
  }

  await sequelize.sync();
}

module.exports = { initDatabase };
