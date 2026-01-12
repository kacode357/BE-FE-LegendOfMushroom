const { sendSuccess } = require("../../utils/response");
const {
  normalizeCreateNotificationPayload,
  normalizeUpdateNotificationPayload,
} = require("./notification.payload");
const {
  createNotification,
  listNotifications,
  listNotificationsByPackageId,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require("./notification.service");

function formatNotification(doc) {
  return {
    id: String(doc.id),
    packageId: String(doc.packageId),
    title: doc.title,
    content: doc.content,
    createdBy: doc.createdBy,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function create(req, res, next) {
  try {
    const payload = normalizeCreateNotificationPayload(req.body);
    const createdBy = req.auth?.sub || null;
    const doc = await createNotification({ ...payload, createdBy });

    return sendSuccess(res, {
      message: "created",
      data: formatNotification(doc),
    });
  } catch (err) {
    return next(err);
  }
}

async function list(_req, res, next) {
  try {
    const docs = await listNotifications();
    return sendSuccess(res, {
      message: "ok",
      data: {
        items: docs.map(formatNotification),
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function listByPackage(req, res, next) {
  try {
    const { packageId } = req.params;
    const docs = await listNotificationsByPackageId(packageId);
    return sendSuccess(res, {
      message: "ok",
      data: {
        items: docs.map(formatNotification),
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function get(req, res, next) {
  try {
    const doc = await getNotificationById(req.params.id);
    return sendSuccess(res, {
      message: "ok",
      data: formatNotification(doc),
    });
  } catch (err) {
    return next(err);
  }
}

async function patch(req, res, next) {
  try {
    const payload = normalizeUpdateNotificationPayload(req.body);
    const doc = await updateNotification(req.params.id, payload);
    return sendSuccess(res, {
      message: "updated",
      data: formatNotification(doc),
    });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await deleteNotification(req.params.id);
    return sendSuccess(res, {
      message: "deleted",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  listByPackage,
  get,
  patch,
  remove,
};
