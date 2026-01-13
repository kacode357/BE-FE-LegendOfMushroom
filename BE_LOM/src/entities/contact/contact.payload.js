function normalizeCreateContactPayload(body) {
  return {
    name: body?.name ?? "",
    email: body?.email ?? null,
    phone: body?.phone ?? null,
    subject: body?.subject ?? "",
    message: body?.message ?? "",
  };
}

function normalizeUpdateContactPayload(body) {
  const result = {};
  if (body?.status !== undefined) result.status = body.status;
  if (body?.adminNote !== undefined) result.adminNote = body.adminNote;
  return result;
}

module.exports = {
  normalizeCreateContactPayload,
  normalizeUpdateContactPayload,
};
