const { sendSuccess } = require("../../utils/response");
const {
  normalizeCreateUserPayload,
  normalizeUpdateUserPayload,
  normalizeChangePasswordPayload,
} = require("./user.payload");
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
} = require("./user.service");

async function list(req, res, next) {
  try {
    const items = await listUsers();
    return sendSuccess(res, {
      message: "ok",
      data: { items },
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    return sendSuccess(res, {
      message: "ok",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}

async function create(req, res, next) {
  try {
    const payload = normalizeCreateUserPayload(req.body);
    const user = await createUser(payload);
    return sendSuccess(res, {
      message: "Tạo người dùng thành công",
      data: user,
    }, 201);
  } catch (err) {
    return next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const payload = normalizeUpdateUserPayload(req.body);
    const user = await updateUser(id, payload);
    return sendSuccess(res, {
      message: "Cập nhật thành công",
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}

async function changePass(req, res, next) {
  try {
    const { id } = req.params;
    const { newPassword } = normalizeChangePasswordPayload(req.body);
    const result = await changePassword(id, newPassword);
    return sendSuccess(res, {
      message: result.message,
    });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    // Prevent self-deletion
    if (req.auth?.sub === id) {
      return sendSuccess(res, {
        message: "Không thể xóa chính mình",
      }, 400);
    }
    const result = await deleteUser(id);
    return sendSuccess(res, {
      message: result.message,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  list,
  getById,
  create,
  update,
  changePass,
  remove,
};
