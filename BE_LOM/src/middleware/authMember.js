// Middleware to authenticate member (user) requests
const jwt = require("jsonwebtoken");
const { AppError } = require("../utils/appError");

function authenticateMember(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new AppError({
        statusCode: 401,
        code: "MEMBER_UNAUTHORIZED",
        message: "Vui lòng đăng nhập để tiếp tục",
      })
    );
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is missing");
    }

    const decoded = jwt.verify(token, secret);
    
    // Check if this is a member token (not admin)
    if (decoded.type !== "member") {
      return next(
        new AppError({
          statusCode: 403,
          code: "MEMBER_FORBIDDEN",
          message: "Token không hợp lệ",
        })
      );
    }

    req.auth = {
      sub: decoded.sub,
      type: decoded.type,
    };

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(
        new AppError({
          statusCode: 401,
          code: "MEMBER_TOKEN_EXPIRED",
          message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",
        })
      );
    }

    return next(
      new AppError({
        statusCode: 401,
        code: "MEMBER_INVALID_TOKEN",
        message: "Token không hợp lệ",
      })
    );
  }
}

module.exports = { authenticateMember };
