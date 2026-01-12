function normalizeCreateCodePayload(payload) {
  const data = payload || {};
  const ttlMinutesRaw = data.ttlMinutes;
  const ttlMinutes =
    typeof ttlMinutesRaw === "number" && Number.isFinite(ttlMinutesRaw)
      ? ttlMinutesRaw
      : 5;

  return {
    ttlMinutes: Math.max(1, Math.min(60, Math.floor(ttlMinutes))),
  };
}

function normalizeVerifyPayload(payload) {
  const data = payload || {};

  const code = typeof data.code === "string" ? data.code.trim() : "";
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const uid = typeof data.uid === "string" ? data.uid.trim() : "";
  const server = typeof data.server === "string" ? data.server.trim() : "";
  const avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl.trim() : "";
  const packageId = typeof data.packageId === "string" ? data.packageId.trim() : "";

  return { code, name, uid, server, avatarUrl, packageId };
}

function normalizeCheckAccessPayload(payload) {
  const data = payload || {};

  const uid = typeof data.uid === "string" ? data.uid.trim() : "";
  const server = typeof data.server === "string" ? data.server.trim() : "";
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const avatarUrl = typeof data.avatarUrl === "string" ? data.avatarUrl.trim() : "";

  return { uid, server, name, avatarUrl };
}

module.exports = { normalizeCreateCodePayload, normalizeVerifyPayload, normalizeCheckAccessPayload };
