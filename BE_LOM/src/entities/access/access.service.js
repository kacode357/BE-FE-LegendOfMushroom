const crypto = require("crypto");
const AccessCode = require("./access.model");
const Package = require("../package/package.model");
const { AppError } = require("../../utils/appError");
const { Sequelize } = require("../../db/sequelize");

function isUuid(value) {
  const v = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

function generateCode(length = 8) {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

function isSameUser(a, b) {
  if (!a || !b) return false;
  return (
    String(a.uid) === String(b.uid) &&
    String(a.name) === String(b.name) &&
    String(a.server) === String(b.server) &&
    String(a.avatarUrl) === String(b.avatarUrl)
  );
}

async function cleanupExpiredUnusedCodes() {
  // PostgreSQL does not have MongoDB TTL indexes; do a simple cleanup.
  // Only delete codes that were never used and already expired.
  const now = new Date();
  await AccessCode.destroy({
    where: {
      usedAt: null,
      expiresAt: { [Sequelize.Op.lt]: now },
    },
  });
}

async function createAccessCode({ ttlMinutes, createdBy }) {
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await cleanupExpiredUnusedCodes();

  // Try a few times to avoid rare unique collisions.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateCode(8);
    try {
      const doc = await AccessCode.create({ code, expiresAt, createdBy });
      return { code: doc.code, expiresAt: doc.expiresAt };
    } catch (err) {
      // Unique collision -> retry
      if (err && err.name === "SequelizeUniqueConstraintError") continue;
      throw err;
    }
  }

  throw new AppError({
    statusCode: 500,
    code: "ACCESS_CODE_CREATE_FAILED",
    message: "could not generate code",
  });
}

async function verifyOrRegisterAccess(payload) {
  const { code, name, uid, server, avatarUrl, packageId } = payload;

  if (!code || !name || !uid || !server || !packageId) {
    throw new AppError({
      statusCode: 400,
      code: "ACCESS_MISSING_FIELDS",
      message: "code, name, uid, server, packageId are required",
    });
  }

  await cleanupExpiredUnusedCodes();

  const accessCode = await AccessCode.findOne({ where: { code } });
  if (!accessCode) {
    throw new AppError({
      statusCode: 404,
      code: "ACCESS_CODE_NOT_FOUND",
      message: "invalid code",
    });
  }

  const incomingUser = { uid, name, server, avatarUrl };

  if (!isUuid(packageId)) {
    throw new AppError({
      statusCode: 400,
      code: "ACCESS_INVALID_PACKAGE_ID",
      message: "invalid packageId",
    });
  }

  const incomingPackageId = String(packageId);

  // Not used yet -> must be within registration window.
  if (!accessCode.usedAt) {
    if (!accessCode.expiresAt || accessCode.expiresAt.getTime() < Date.now()) {
      throw new AppError({
        statusCode: 410,
        code: "ACCESS_CODE_EXPIRED",
        message: "code expired",
      });
    }

    const pkg = await Package.findByPk(incomingPackageId);
    if (!pkg) {
      throw new AppError({
        statusCode: 404,
        code: "ACCESS_PACKAGE_NOT_FOUND",
        message: "package not found",
      });
    }

    const now = new Date();
    await accessCode.update({
      usedAt: now,
      lastAccessAt: now,
      userUid: incomingUser.uid,
      userName: incomingUser.name,
      userServer: incomingUser.server,
      userAvatarUrl: incomingUser.avatarUrl || null,
      packageId: String(pkg.id),
      packageName: pkg.name,
      // Prevent cleanup deletion after the code is claimed.
      expiresAt: null,
    });

    return {
      ok: true,
      status: "registered",
      message: "registered successfully",
    };
  }

  // Already used -> only allow same user.
  const storedPackageId = accessCode.packageId ? String(accessCode.packageId) : null;
  const storedUser = accessCode.userUid
    ? {
        uid: accessCode.userUid,
        name: accessCode.userName,
        server: accessCode.userServer,
        avatarUrl: accessCode.userAvatarUrl,
      }
    : null;

  if (!isSameUser(storedUser, incomingUser)) {
    throw new AppError({
      statusCode: 403,
      code: "ACCESS_CODE_ALREADY_USED",
      message: "code is already bound to another user",
    });
  }

  if (!storedPackageId || storedPackageId !== String(incomingPackageId)) {
    throw new AppError({
      statusCode: 403,
      code: "ACCESS_CODE_PACKAGE_MISMATCH",
      message: "code is bound to another package",
    });
  }

  await accessCode.update({ lastAccessAt: new Date() });

  return {
    ok: true,
    status: "allowed",
    message: "access granted",
  };
}

async function listRegisteredUsers() {
  const docs = await AccessCode.findAll({
    where: { usedAt: { [Sequelize.Op.ne]: null } },
    order: [["usedAt", "DESC"]],
  });

  return docs.map((d) => ({
    code: d.code,
    user: d.userUid
      ? {
          uid: d.userUid,
          name: d.userName,
          server: d.userServer,
          avatarUrl: d.userAvatarUrl,
        }
      : null,
    package: {
      id: d.packageId ? String(d.packageId) : null,
      name: d.packageName || null,
    },
    usedAt: d.usedAt,
    lastAccessAt: d.lastAccessAt,
    createdAt: d.createdAt,
  }));
}

async function checkUserAccess(payload) {
  const { uid, server, name, avatarUrl, packageId } = payload;

  if (!uid || !server || !packageId) {
    throw new AppError({
      statusCode: 400,
      code: "ACCESS_MISSING_FIELDS",
      message: "uid, server and packageId are required",
    });
  }

  if (!isUuid(packageId)) {
    throw new AppError({
      statusCode: 400,
      code: "ACCESS_INVALID_PACKAGE_ID",
      message: "invalid packageId",
    });
  }

  // Find access code by uid, server and packageId
  const accessCode = await AccessCode.findOne({
    where: {
      userUid: uid,
      userServer: server,
      packageId: String(packageId),
      usedAt: { [Sequelize.Op.ne]: null },
    },
  });

  if (!accessCode) {
    throw new AppError({
      statusCode: 404,
      code: "ACCESS_NOT_FOUND",
      message: "no access found for this user with this package",
    });
  }

  // Update name and avatar if provided
  const updates = { lastAccessAt: new Date() };
  if (name) updates.userName = name;
  if (avatarUrl) updates.userAvatarUrl = avatarUrl;
  
  await accessCode.update(updates);

  return {
    ok: true,
    allowed: true,
    message: "access granted",
    package: {
      id: accessCode.packageId ? String(accessCode.packageId) : null,
      name: accessCode.packageName || null,
    },
  };
}

module.exports = { createAccessCode, verifyOrRegisterAccess, listRegisteredUsers, checkUserAccess };
