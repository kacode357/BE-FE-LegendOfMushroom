function normalizeCreatePackagePayload(payload) {
  const data = payload || {};
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const description = typeof data.description === "string" ? data.description.trim() : "";
  const fileUrl = typeof data.fileUrl === "string" ? data.fileUrl.trim() : "";

  return { name, description, fileUrl };
}

function normalizeUpdatePackagePayload(payload) {
  const data = payload || {};

  const name = typeof data.name === "string" ? data.name.trim() : undefined;
  const description =
    typeof data.description === "string" ? data.description.trim() : undefined;
  const fileUrl = typeof data.fileUrl === "string" ? data.fileUrl.trim() : undefined;

  return { name, description, fileUrl };
}

module.exports = { normalizeCreatePackagePayload, normalizeUpdatePackagePayload };
