// Auth business logic (validation, auth, token generation).
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../user/user.model");
const { AppError } = require("../../utils/appError");
const { normalizeLoginPayload, buildLoginResponse } = require("./auth.payload");
const MESSAGES = require("../../constants/messages");

// Read JWT config from env with validation.
function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES || "1d",
  };
}

// Validate credentials and return JWT + user info.
async function login(payload) {
  const { email, password } = normalizeLoginPayload(payload);
  if (!email || !password) {
    throw new AppError({
      message: MESSAGES.AUTH.MISSING_CREDENTIALS,
      statusCode: 400,
      code: "AUTH_MISSING_CREDENTIALS",
    });
  }

  const user = await User.scope("withPassword").findOne({ where: { email } });
  if (!user || !user.isActive) {
    throw new AppError({
      message: MESSAGES.AUTH.INVALID_CREDENTIALS,
      statusCode: 401,
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new AppError({
      message: MESSAGES.AUTH.INVALID_CREDENTIALS,
      statusCode: 401,
      code: "AUTH_INVALID_CREDENTIALS",
    });
  }

  const { secret, expiresIn } = getJwtConfig();
  const token = jwt.sign(
    { sub: String(user.id), role: user.role },
    secret,
    { expiresIn }
  );

  return buildLoginResponse(token, user);
}

module.exports = { login };
