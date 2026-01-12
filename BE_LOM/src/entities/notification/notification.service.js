const Notification = require("./notification.model");
const Package = require("../package/package.model");
const { AppError } = require("../../utils/appError");

function isUuid(value) {
  const v = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function assertNonEmpty(value, field) {
  if (!value || !String(value).trim()) {
    throw new AppError({
      statusCode: 400,
      code: "NOTIFICATION_MISSING_FIELD",
      message: `${field} is required`,
    });
  }
}

async function createNotification({ packageId, title, content, createdBy }) {
  assertNonEmpty(packageId, "packageId");
  assertNonEmpty(title, "title");

  // Check if package exists
  if (!isUuid(packageId)) {
    throw new AppError({
      statusCode: 400,
      code: "NOTIFICATION_INVALID_PACKAGE_ID",
      message: "invalid package id",
    });
  }

  const pkg = await Package.findByPk(packageId);
  if (!pkg) {
    throw new AppError({
      statusCode: 404,
      code: "PACKAGE_NOT_FOUND",
      message: "package not found",
    });
  }

  // Check if notification already exists for this package
  const existing = await Notification.findOne({ where: { packageId } });
  if (existing) {
    // Update existing notification instead of creating new one
    await existing.update({ title, content, createdBy });
    return existing;
  }

  return await Notification.create({ packageId, title, content, createdBy });
}

async function listNotifications() {
  return Notification.findAll({ order: [["createdAt", "DESC"]] });
}

async function listNotificationsByPackageId(packageId) {
  if (!isUuid(packageId)) {
    throw new AppError({
      statusCode: 400,
      code: "NOTIFICATION_INVALID_PACKAGE_ID",
      message: "invalid package id",
    });
  }

  return Notification.findAll({
    where: { packageId },
    order: [["createdAt", "DESC"]],
  });
}

async function getNotificationById(id) {
  if (!isUuid(id)) {
    throw new AppError({
      statusCode: 400,
      code: "NOTIFICATION_INVALID_ID",
      message: "invalid notification id",
    });
  }

  const doc = await Notification.findByPk(String(id));
  if (!doc) {
    throw new AppError({
      statusCode: 404,
      code: "NOTIFICATION_NOT_FOUND",
      message: "notification not found",
    });
  }

  return doc;
}

async function updateNotification(id, patch) {
  const doc = await getNotificationById(id);

  const next = {};
  if (patch.title !== undefined) {
    assertNonEmpty(patch.title, "title");
    next.title = patch.title;
  }
  if (patch.content !== undefined) next.content = patch.content;

  await doc.update(next);
  return doc;
}

async function deleteNotification(id) {
  const doc = await getNotificationById(id);
  await doc.destroy();
  return { id: String(doc.id) };
}

module.exports = {
  createNotification,
  listNotifications,
  listNotificationsByPackageId,
  getNotificationById,
  updateNotification,
  deleteNotification,
};
