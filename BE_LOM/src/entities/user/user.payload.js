const { createAppError } = require("../../utils/appError");
const MESSAGES = require("../../constants/messages");

function normalizeCreateUserPayload(body) {
  const { email, password, name, role } = body || {};

  if (!email || typeof email !== "string" || !email.trim()) {
    throw createAppError("Email là bắt buộc", 400);
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw createAppError("Mật khẩu phải có ít nhất 6 ký tự", 400);
  }

  if (!name || typeof name !== "string" || !name.trim()) {
    throw createAppError("Tên là bắt buộc", 400);
  }

  return {
    email: email.trim().toLowerCase(),
    password,
    name: name.trim(),
    role: role && typeof role === "string" ? role.trim() : "admin",
  };
}

function normalizeUpdateUserPayload(body) {
  const { name, role, isActive } = body || {};
  const result = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw createAppError("Tên không hợp lệ", 400);
    }
    result.name = name.trim();
  }

  if (role !== undefined) {
    if (typeof role !== "string" || !role.trim()) {
      throw createAppError("Role không hợp lệ", 400);
    }
    result.role = role.trim();
  }

  if (isActive !== undefined) {
    result.isActive = Boolean(isActive);
  }

  return result;
}

function normalizeChangePasswordPayload(body) {
  const { newPassword } = body || {};

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    throw createAppError("Mật khẩu mới phải có ít nhất 6 ký tự", 400);
  }

  return { newPassword };
}

module.exports = {
  normalizeCreateUserPayload,
  normalizeUpdateUserPayload,
  normalizeChangePasswordPayload,
};
