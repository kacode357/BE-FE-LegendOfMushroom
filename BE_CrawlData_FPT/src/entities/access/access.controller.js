const { sendSuccess } = require("../../utils/response");
const { normalizeCreateCodePayload, normalizeVerifyPayload } = require("./access.payload");
const { createAccessCode, verifyOrRegisterAccess, listRegisteredUsers } = require("./access.service");

async function createCode(req, res, next) {
  try {
    const { ttlMinutes } = normalizeCreateCodePayload(req.body);
    const createdBy = req.auth?.sub || null;

    const result = await createAccessCode({ ttlMinutes, createdBy });
    return sendSuccess(res, {
      message: "created",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

async function verify(req, res, next) {
  try {
    const payload = normalizeVerifyPayload(req.body);
    const result = await verifyOrRegisterAccess(payload);
    return sendSuccess(res, {
      message: result.message,
      data: { status: result.status },
    });
  } catch (err) {
    return next(err);
  }
}

async function getUsers(_req, res, next) {
  try {
    const items = await listRegisteredUsers();
    return sendSuccess(res, {
      message: "ok",
      data: { items },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createCode, verify, getUsers };
