const User = require("./user.model");
const bcrypt = require("bcrypt");
const { createAppError } = require("../../utils/appError");
const MESSAGES = require("../../constants/messages");

const SALT_ROUNDS = 10;

async function listUsers() {
  const users = await User.findAll({
    order: [["createdAt", "DESC"]],
  });
  return users;
}

async function getUserById(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw createAppError(MESSAGES.NOT_FOUND, 404);
  }
  return user;
}

async function createUser({ email, password, name, role = "admin" }) {
  // Check if email already exists
  const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    throw createAppError("Email đã tồn tại", 400);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({
    email,
    passwordHash,
    name,
    role,
    isActive: true,
  });

  // Return without password
  const { passwordHash: _, ...userData } = user.toJSON();
  return userData;
}

async function updateUser(id, { name, role, isActive }) {
  const user = await User.findByPk(id);
  if (!user) {
    throw createAppError(MESSAGES.NOT_FOUND, 404);
  }

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();
  return user;
}

async function changePassword(id, newPassword) {
  const user = await User.findByPk(id);
  if (!user) {
    throw createAppError(MESSAGES.NOT_FOUND, 404);
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.passwordHash = passwordHash;
  await user.save();

  return { message: "Đổi mật khẩu thành công" };
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    throw createAppError(MESSAGES.NOT_FOUND, 404);
  }

  await user.destroy();
  return { message: "Xóa người dùng thành công" };
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
};
