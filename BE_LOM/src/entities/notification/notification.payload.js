function normalizeCreateNotificationPayload(body) {
  return {
    packageId: body?.packageId ?? "",
    title: body?.title ?? "",
    content: body?.content ?? "",
  };
}

function normalizeUpdateNotificationPayload(body) {
  const result = {};
  if (body?.title !== undefined) result.title = body.title;
  if (body?.content !== undefined) result.content = body.content;
  return result;
}

module.exports = {
  normalizeCreateNotificationPayload,
  normalizeUpdateNotificationPayload,
};
