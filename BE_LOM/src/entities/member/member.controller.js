const { sendSuccess } = require("../../utils/response");
const {
  normalizeRegisterPayload,
  normalizeLoginPayload,
  normalizeForgotPasswordPayload,
  normalizeResetPasswordPayload,
  normalizeVerifyEmailPayload,
  buildMemberResponse,
  buildLoginResponse,
} = require("./member.payload");
const {
  register: registerService,
  verifyEmail: verifyEmailService,
  login: loginService,
  forgotPassword: forgotPasswordService,
  resetPassword: resetPasswordService,
  getMemberById,
  resendVerification: resendVerificationService,
} = require("./member.service");

/**
 * Register new member
 */
async function register(req, res, next) {
  try {
    const payload = normalizeRegisterPayload(req.body);
    const member = await registerService(payload);

    return sendSuccess(res, {
      message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản",
      data: buildMemberResponse(member),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Verify email
 */
async function verifyEmail(req, res, next) {
  try {
    const { token } = normalizeVerifyEmailPayload(req.body);
    const member = await verifyEmailService(token);

    return sendSuccess(res, {
      message: "Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ",
      data: buildMemberResponse(member),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Login
 */
async function login(req, res, next) {
  try {
    const payload = normalizeLoginPayload(req.body);
    const { token, member } = await loginService(payload);

    return sendSuccess(res, {
      message: "Đăng nhập thành công",
      data: buildLoginResponse(token, member),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Forgot password
 */
async function forgotPassword(req, res, next) {
  try {
    const { email } = normalizeForgotPasswordPayload(req.body);
    const result = await forgotPasswordService(email);

    return sendSuccess(res, {
      message: result.message,
      data: null,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Reset password
 */
async function resetPassword(req, res, next) {
  try {
    const { token, password } = normalizeResetPasswordPayload(req.body);
    const result = await resetPasswordService(token, password);

    return sendSuccess(res, {
      message: result.message,
      data: null,
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Get current member profile
 */
async function getProfile(req, res, next) {
  try {
    const memberId = req.auth?.sub;
    const member = await getMemberById(memberId);

    return sendSuccess(res, {
      message: "ok",
      data: buildMemberResponse(member),
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * Resend verification email
 */
async function resendVerification(req, res, next) {
  try {
    const { email } = normalizeForgotPasswordPayload(req.body);
    const result = await resendVerificationService(email);

    return sendSuccess(res, {
      message: result.message,
      data: null,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  resendVerification,
};
