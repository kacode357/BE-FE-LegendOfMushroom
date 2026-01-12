// Custom error type for controlled API errors.
class AppError extends Error {
  constructor({ message, statusCode = 500, code = "SERVER_ERROR", details = null }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Type guard to distinguish known AppError instances.
function isAppError(err) {
  return err instanceof AppError;
}

module.exports = { AppError, isAppError };
