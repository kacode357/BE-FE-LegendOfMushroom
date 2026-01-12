// Accept either bearer token (Swagger / API clients) or encrypted HttpOnly cookie (FE).
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");

const AUTH_COOKIE_NAME = String(process.env.AUTH_COOKIE_NAME || "__a~") || "__a~";

function getCookieKey() {
  const secret = process.env.AUTH_COOKIE_SECRET;
  if (!secret || String(secret).trim().length < 16) {
    throw new Error("AUTH_COOKIE_SECRET is missing (min 16 chars)");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

function decryptJson(base64urlValue) {
  const raw = Buffer.from(String(base64urlValue), "base64url");
  if (raw.length < 12 + 16 + 1) {
    throw new Error("invalid cookie payload");
  }

  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);

  const decipher = crypto.createDecipheriv("aes-256-gcm", getCookieKey(), iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8"));
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return secret;
}

function tryBearer(req) {
  const header = req.headers.authorization || "";
  const [, token] = String(header).split(" ");
  if (!token) return false;

  const payload = jwt.verify(token, getJwtSecret());
  req.auth = payload;
  return true;
}

function tryCookie(req) {
  const cookieValue = req.cookies?.[AUTH_COOKIE_NAME];
  if (!cookieValue) return false;

  const data = decryptJson(cookieValue);
  const token = data && typeof data.token === "string" ? data.token : null;
  if (!token) return false;

  const payload = jwt.verify(token, getJwtSecret());
  req.auth = payload;
  req.authUser = data.user || null;
  return true;
}

function authenticateAny(req, _res, next) {
  try {
    if (tryCookie(req)) return next();
    if (tryBearer(req)) return next();

    return next(
      new AppError({
        statusCode: 401,
        code: "AUTH_MISSING_TOKEN",
        message: "missing authorization",
      })
    );
  } catch (error) {
    return next(
      new AppError({
        statusCode: 401,
        code: "AUTH_INVALID_TOKEN",
        message: "invalid or expired authorization",
      })
    );
  }
}

module.exports = { authenticateAny };
