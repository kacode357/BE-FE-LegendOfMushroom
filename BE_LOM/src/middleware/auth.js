// JWT auth + role guards for protected routes.
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }
  return secret;
}

function authenticate(req, _res, next) {
  const header = req.headers.authorization || "";
  const [, token] = header.split(" ");

  if (!token) {
    return next(
      new AppError({
        statusCode: 401,
        code: "AUTH_MISSING_TOKEN",
        message: "missing authorization token",
      })
    );
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    req.auth = payload;
    return next();
  } catch (error) {
    return next(
      new AppError({
        statusCode: 401,
        code: "AUTH_INVALID_TOKEN",
        message: "invalid or expired token",
      })
    );
  }
}

function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!roles.length) {
      return next();
    }

    const role = req.auth?.role;
    if (!role || !roles.includes(role)) {
      return next(
        new AppError({
          statusCode: 403,
          code: "AUTH_FORBIDDEN",
          message: "forbidden",
        })
      );
    }

    return next();
  };
}

module.exports = { authenticate, authorizeRoles };
