// Admin seeding logic to ensure a default admin exists.
const bcrypt = require("bcrypt");
const User = require("./user.model");
const adminUser = require("./adminUser");

const SALT_ROUNDS = 10;

async function ensureAdminUser() {
  const passwordHash = await bcrypt.hash(adminUser.password, SALT_ROUNDS);

  const values = {
    email: adminUser.email,
    passwordHash,
    name: adminUser.name,
    role: adminUser.role,
    isActive: true,
  };

  // Sequelize returns [instance, created] for findOrCreate; for upsert it returns different shapes
  // depending on dialect. We only need to guarantee the row exists.
  await User.upsert(values);
  return User.findOne({ where: { email: adminUser.email } });
}

module.exports = { ensureAdminUser };
