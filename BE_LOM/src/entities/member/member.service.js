const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Member = require("./member.model");
const { AppError } = require("../../utils/appError");
const { sendVerificationEmail, sendResetPasswordEmail } = require("../../utils/email");

const SALT_ROUNDS = 10;

function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES || "7d",
  };
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  // At least 6 characters
  return password && password.length >= 6;
}

/**
 * Register new member
 */
async function register({ email, password, name, phone }) {
  // Validate required fields
  if (!email || !password || !name) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_MISSING_FIELDS",
      message: "Email, mật khẩu và họ tên là bắt buộc",
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_EMAIL",
      message: "Email không hợp lệ",
    });
  }

  // Validate password
  if (!isValidPassword(password)) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_PASSWORD",
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  }

  // Check if email exists
  const existing = await Member.findOne({ where: { email: email.toLowerCase().trim() } });
  if (existing) {
    throw new AppError({
      statusCode: 409,
      code: "MEMBER_EMAIL_EXISTS",
      message: "Email đã được sử dụng",
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate verification token
  const verifyToken = generateToken();
  const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create member
  const member = await Member.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name.trim(),
    phone: phone ? phone.trim() : null,
    verifyToken,
    verifyTokenExpires,
    isVerified: false,
  });

  // Send verification email
  try {
    await sendVerificationEmail(member.email, member.name, verifyToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
    // Don't fail registration if email fails
  }

  return member;
}

/**
 * Verify email
 */
async function verifyEmail(token) {
  if (!token) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_TOKEN",
      message: "Token không hợp lệ",
    });
  }

  const member = await Member.scope("withTokens").findOne({
    where: { verifyToken: token },
  });

  if (!member) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_TOKEN",
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  if (member.verifyTokenExpires && new Date(member.verifyTokenExpires) < new Date()) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_TOKEN_EXPIRED",
      message: "Token đã hết hạn. Vui lòng đăng ký lại",
    });
  }

  await member.update({
    isVerified: true,
    verifyToken: null,
    verifyTokenExpires: null,
  });

  return member;
}

/**
 * Login
 */
async function login({ email, password }) {
  if (!email || !password) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_MISSING_CREDENTIALS",
      message: "Email và mật khẩu là bắt buộc",
    });
  }

  const member = await Member.scope("withPassword").findOne({
    where: { email: email.toLowerCase().trim() },
  });

  if (!member) {
    throw new AppError({
      statusCode: 401,
      code: "MEMBER_INVALID_CREDENTIALS",
      message: "Email hoặc mật khẩu không đúng",
    });
  }

  if (!member.isActive) {
    throw new AppError({
      statusCode: 403,
      code: "MEMBER_INACTIVE",
      message: "Tài khoản đã bị khóa",
    });
  }

  if (!member.isVerified) {
    throw new AppError({
      statusCode: 403,
      code: "MEMBER_NOT_VERIFIED",
      message: "Vui lòng xác thực email trước khi đăng nhập",
    });
  }

  const isMatch = await bcrypt.compare(password, member.passwordHash);
  if (!isMatch) {
    throw new AppError({
      statusCode: 401,
      code: "MEMBER_INVALID_CREDENTIALS",
      message: "Email hoặc mật khẩu không đúng",
    });
  }

  // Update last login
  await member.update({ lastLoginAt: new Date() });

  // Generate JWT
  const { secret, expiresIn } = getJwtConfig();
  const token = jwt.sign(
    { sub: String(member.id), type: "member" },
    secret,
    { expiresIn }
  );

  return { token, member };
}

/**
 * Forgot password - send reset email
 */
async function forgotPassword(email) {
  if (!email) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_MISSING_EMAIL",
      message: "Email là bắt buộc",
    });
  }

  const member = await Member.findOne({
    where: { email: email.toLowerCase().trim() },
  });

  if (!member) {
    // Don't reveal if email exists
    return { message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu" };
  }

  // Generate reset token
  const resetPasswordToken = generateToken();
  const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await member.update({
    resetPasswordToken,
    resetPasswordExpires,
  });

  // Send reset email
  try {
    await sendResetPasswordEmail(member.email, member.name, resetPasswordToken);
  } catch (err) {
    console.error("Failed to send reset password email:", err.message);
    throw new AppError({
      statusCode: 500,
      code: "EMAIL_SEND_FAILED",
      message: "Không thể gửi email. Vui lòng thử lại sau",
    });
  }

  return { message: "Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu" };
}

/**
 * Reset password
 */
async function resetPassword(token, newPassword) {
  if (!token || !newPassword) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_MISSING_FIELDS",
      message: "Token và mật khẩu mới là bắt buộc",
    });
  }

  if (!isValidPassword(newPassword)) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_PASSWORD",
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    });
  }

  const member = await Member.scope("withTokens").findOne({
    where: { resetPasswordToken: token },
  });

  if (!member) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_INVALID_TOKEN",
      message: "Token không hợp lệ hoặc đã hết hạn",
    });
  }

  if (member.resetPasswordExpires && new Date(member.resetPasswordExpires) < new Date()) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_TOKEN_EXPIRED",
      message: "Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới",
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

  await member.update({
    passwordHash,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return { message: "Đặt lại mật khẩu thành công" };
}

/**
 * Get member by ID
 */
async function getMemberById(id) {
  const member = await Member.findByPk(id);
  if (!member) {
    throw new AppError({
      statusCode: 404,
      code: "MEMBER_NOT_FOUND",
      message: "Không tìm thấy người dùng",
    });
  }
  return member;
}

/**
 * Resend verification email
 */
async function resendVerification(email) {
  if (!email) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_MISSING_EMAIL",
      message: "Email là bắt buộc",
    });
  }

  const member = await Member.scope("withTokens").findOne({
    where: { email: email.toLowerCase().trim() },
  });

  if (!member) {
    return { message: "Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email xác thực" };
  }

  if (member.isVerified) {
    throw new AppError({
      statusCode: 400,
      code: "MEMBER_ALREADY_VERIFIED",
      message: "Email đã được xác thực",
    });
  }

  // Generate new verification token
  const verifyToken = generateToken();
  const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await member.update({
    verifyToken,
    verifyTokenExpires,
  });

  try {
    await sendVerificationEmail(member.email, member.name, verifyToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
    throw new AppError({
      statusCode: 500,
      code: "EMAIL_SEND_FAILED",
      message: "Không thể gửi email. Vui lòng thử lại sau",
    });
  }

  return { message: "Nếu email tồn tại và chưa xác thực, bạn sẽ nhận được email xác thực" };
}

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getMemberById,
  resendVerification,
};
