// Response helpers to keep API payloads consistent.
function sendSuccess(
  res,
  { statusCode = 200, message, data = null, dataPage = null, infoPage = null }
) {
  const payload = {
    success: true,
    status: statusCode,
    message,
    data,
  };

  if (dataPage !== null && dataPage !== undefined) {
    payload.dataPage = dataPage;
  }

  if (infoPage !== null && infoPage !== undefined) {
    payload.infoPage = infoPage;
  }

  return res.status(statusCode).json(payload);
}

// Standard error response wrapper.
function sendError(res, { statusCode = 500, message, code = "SERVER_ERROR", errors = null }) {
  return res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    code,
    errors,
  });
}

module.exports = { sendSuccess, sendError };
