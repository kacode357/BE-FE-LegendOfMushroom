const Package = require("./package.model");
const { AppError } = require("../../utils/appError");

function isUuid(value) {
  const v = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function assertNonEmpty(value, field) {
  if (!value || !String(value).trim()) {
    throw new AppError({
      statusCode: 400,
      code: "PACKAGE_MISSING_FIELD",
      message: `${field} is required`,
    });
  }
}

async function createPackage({ name, description, fileUrl, createdBy }) {
  assertNonEmpty(name, "name");

  try {
    return await Package.create({ name, description, fileUrl, createdBy });
  } catch (err) {
    if (err && err.name === "SequelizeUniqueConstraintError") {
      throw new AppError({
        statusCode: 409,
        code: "PACKAGE_NAME_EXISTS",
        message: "package name already exists",
      });
    }
    throw err;
  }
}

async function listPackages() {
  return Package.findAll({ order: [["createdAt", "DESC"]] });
}

async function getPackageById(id) {
  if (!isUuid(id)) {
    throw new AppError({
      statusCode: 400,
      code: "PACKAGE_INVALID_ID",
      message: "invalid package id",
    });
  }

  const doc = await Package.findByPk(String(id));
  if (!doc) {
    throw new AppError({
      statusCode: 404,
      code: "PACKAGE_NOT_FOUND",
      message: "package not found",
    });
  }

  return doc;
}

async function updatePackage(id, patch) {
  const doc = await getPackageById(id);

  const next = {};
  if (patch.name !== undefined) {
    assertNonEmpty(patch.name, "name");
    next.name = patch.name;
  }
  if (patch.description !== undefined) next.description = patch.description;
  if (patch.fileUrl !== undefined) next.fileUrl = patch.fileUrl;

  try {
    await doc.update(next);
    return doc;
  } catch (err) {
    if (err && err.name === "SequelizeUniqueConstraintError") {
      throw new AppError({
        statusCode: 409,
        code: "PACKAGE_NAME_EXISTS",
        message: "package name already exists",
      });
    }
    throw err;
  }
}

async function deletePackage(id) {
  const doc = await getPackageById(id);
  await doc.destroy();
  return { id: String(doc.id) };
}

module.exports = {
  createPackage,
  listPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
