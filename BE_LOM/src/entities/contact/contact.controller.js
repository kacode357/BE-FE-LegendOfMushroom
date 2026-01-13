const { sendSuccess } = require("../../utils/response");
const {
  normalizeCreateContactPayload,
  normalizeUpdateContactPayload,
} = require("./contact.payload");
const {
  createContact,
  listContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  countByStatus,
  listContactsByMember,
  replyToContact,
} = require("./contact.service");

function formatContact(doc) {
  return {
    id: String(doc.id),
    memberId: doc.memberId ? String(doc.memberId) : null,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    subject: doc.subject,
    message: doc.message,
    status: doc.status,
    adminNote: doc.adminNote,
    adminReply: doc.adminReply,
    repliedAt: doc.repliedAt,
    handledBy: doc.handledBy,
    handledAt: doc.handledAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Member: Create a contact request (auth required)
async function create(req, res, next) {
  try {
    const payload = normalizeCreateContactPayload(req.body);
    const memberId = req.auth?.sub;
    const doc = await createContact({ ...payload, memberId });

    return sendSuccess(res, {
      message: "Gửi yêu cầu hỗ trợ thành công",
      data: formatContact(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: List all contacts
async function list(req, res, next) {
  try {
    const { status, limit, offset } = req.query;
    const result = await listContacts({
      status: status || undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return sendSuccess(res, {
      message: "ok",
      data: {
        items: result.items.map(formatContact),
        total: result.total,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: Get single contact
async function get(req, res, next) {
  try {
    const doc = await getContactById(req.params.id);
    return sendSuccess(res, {
      message: "ok",
      data: formatContact(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: Update contact status
async function patch(req, res, next) {
  try {
    const payload = normalizeUpdateContactPayload(req.body);
    const handledBy = req.auth?.sub || null;
    const doc = await updateContactStatus(req.params.id, { ...payload, handledBy });

    return sendSuccess(res, {
      message: "updated",
      data: formatContact(doc),
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: Delete contact
async function remove(req, res, next) {
  try {
    const result = await deleteContact(req.params.id);
    return sendSuccess(res, {
      message: "deleted",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: Get count by status
async function stats(req, res, next) {
  try {
    const result = await countByStatus();
    return sendSuccess(res, {
      message: "ok",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

// Member: Get my contact requests
async function myContacts(req, res, next) {
  try {
    const memberId = req.auth?.sub;
    const { limit, offset } = req.query;
    const result = await listContactsByMember(memberId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });

    return sendSuccess(res, {
      message: "ok",
      data: {
        items: result.items.map(formatContact),
        total: result.total,
      },
    });
  } catch (err) {
    return next(err);
  }
}

// Admin: Reply to contact
async function reply(req, res, next) {
  try {
    const { adminReply } = req.body;
    if (!adminReply || !String(adminReply).trim()) {
      return next({
        statusCode: 400,
        code: "CONTACT_REPLY_REQUIRED",
        message: "Reply message is required",
      });
    }
    
    const handledBy = req.auth?.sub || null;
    const doc = await replyToContact(req.params.id, {
      adminReply: String(adminReply).trim(),
      handledBy,
    });

    return sendSuccess(res, {
      message: "Đã gửi phản hồi",
      data: formatContact(doc),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  get,
  patch,
  remove,
  stats,
  myContacts,
  reply,
};
