// Auth request handlers (HTTP layer).
const { login: loginService } = require("./auth.service");
const { sendSuccess } = require("../../utils/response");
const MESSAGES = require("../../constants/messages");
const crypto = require("crypto");

const AUTH_COOKIE_NAME = String(process.env.AUTH_COOKIE_NAME || "__a~") || "__a~";

function getCookieKey() {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || String(secret).trim().length < 16) {
    throw new Error("AUTH_COOKIE_SECRET is missing (min 16 chars)");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function encryptJson(value) {
  const key = getCookieKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(value), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}

// Login controller: validates via service and returns API response.
async function login(req, res, next) {
  try {
    const data = await loginService(req.body);

    // Store encrypted auth data in HttpOnly cookie so client JS cannot read it.
    const encrypted = encryptJson(data);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(AUTH_COOKIE_NAME, encrypted, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return sendSuccess(res, {
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      // Include token so Swagger UI can authorize requests.
      // FE can ignore this field; it still uses the HttpOnly cookie.
      data: { user: data.user, token: data.token },
    });
  } catch (err) {
    return next(err);
  }
}

// Logout controller: stateless JWT, client clears token.
function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });

  return sendSuccess(res, {
    message: MESSAGES.AUTH.LOGOUT_SUCCESS,
    data: null,
  });
}

module.exports = { login, logout };
