const { sendSuccess } = require("../../utils/response");
const {
  normalizeCreatePackagePayload,
  normalizeUpdatePackagePayload,
} = require("./package.payload");
const {
  createPackage,
  listPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("./package.service");

async function create(req, res, next) {
  try {
    const payload = normalizeCreatePackagePayload(req.body);
    const createdBy = req.auth?.sub || null;
    const doc = await createPackage({ ...payload, createdBy });

    return sendSuccess(res, {
      message: "created",
      data: {
        id: String(doc.id),
        name: doc.name,
        description: doc.description,
        fileUrl: doc.fileUrl,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function list(_req, res, next) {
  try {
    const docs = await listPackages();
    return sendSuccess(res, {
      message: "ok",
      data: {
        items: docs.map((doc) => ({
          id: String(doc.id),
          name: doc.name,
          description: doc.description,
          fileUrl: doc.fileUrl,
          createdBy: doc.createdBy,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })),
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function get(req, res, next) {
  try {
    const doc = await getPackageById(req.params.id);
    return sendSuccess(res, {
      message: "ok",
      data: {
        id: String(doc.id),
        name: doc.name,
        description: doc.description,
        fileUrl: doc.fileUrl,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function patch(req, res, next) {
  try {
    const payload = normalizeUpdatePackagePayload(req.body);
    const doc = await updatePackage(req.params.id, payload);

    return sendSuccess(res, {
      message: "updated",
      data: {
        id: String(doc.id),
        name: doc.name,
        description: doc.description,
        fileUrl: doc.fileUrl,
        createdBy: doc.createdBy,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function remove(req, res, next) {
  try {
    const result = await deletePackage(req.params.id);
    return sendSuccess(res, {
      message: "deleted",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, list, get, patch, remove };
