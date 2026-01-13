const Contact = require("./contact.model");
const { AppError } = require("../../utils/appError");
const { sendContactConfirmationEmail } = require("../../utils/email");

function isUuid(value) {
  const v = String(value || "").trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

function assertNonEmpty(value, field) {
  if (!value || !String(value).trim()) {
    throw new AppError({
      statusCode: 400,
      code: "CONTACT_MISSING_FIELD",
      message: `${field} is required`,
    });
  }
}

const VALID_STATUSES = ["pending", "processing", "resolved", "closed"];

function validateStatus(status) {
  if (!VALID_STATUSES.includes(status)) {
    throw new AppError({
      statusCode: 400,
      code: "CONTACT_INVALID_STATUS",
      message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
    });
  }
}

async function createContact({ memberId, name, email, phone, subject, message }) {
  assertNonEmpty(memberId, "memberId");
  assertNonEmpty(subject, "subject");
  assertNonEmpty(message, "message");

  const contact = await Contact.create({
    memberId,
    name: String(name).trim(),
    email: email ? String(email).trim() : null,
    phone: phone ? String(phone).trim() : null,
    subject: String(subject).trim(),
    message: String(message).trim(),
    status: "pending",
  });

  // Send confirmation email
  if (email) {
    try {
      await sendContactConfirmationEmail(email, name, subject);
    } catch (err) {
      console.error("Failed to send contact confirmation email:", err.message);
    }
  }

  return contact;
}

async function listContacts({ status, limit = 100, offset = 0 } = {}) {
  const where = {};
  if (status) {
    validateStatus(status);
    where.status = status;
  }

  const { rows, count } = await Contact.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { items: rows, total: count };
}

async function getContactById(id) {
  if (!isUuid(id)) {
    throw new AppError({
      statusCode: 400,
      code: "CONTACT_INVALID_ID",
      message: "invalid contact id",
    });
  }

  const doc = await Contact.findByPk(id);
  if (!doc) {
    throw new AppError({
      statusCode: 404,
      code: "CONTACT_NOT_FOUND",
      message: "contact not found",
    });
  }

  return doc;
}

async function updateContactStatus(id, { status, adminNote, handledBy }) {
  const doc = await getContactById(id);

  if (status) {
    validateStatus(status);
  }

  const updates = {};
  if (status) updates.status = status;
  if (adminNote !== undefined) updates.adminNote = adminNote;
  if (handledBy) {
    updates.handledBy = handledBy;
    updates.handledAt = new Date();
  }

  await doc.update(updates);
  return doc;
}

async function deleteContact(id) {
  const doc = await getContactById(id);
  await doc.destroy();
  return { id };
}

async function countByStatus() {
  const [pending, processing, resolved, closed] = await Promise.all([
    Contact.count({ where: { status: "pending" } }),
    Contact.count({ where: { status: "processing" } }),
    Contact.count({ where: { status: "resolved" } }),
    Contact.count({ where: { status: "closed" } }),
  ]);

  return { pending, processing, resolved, closed, total: pending + processing + resolved + closed };
}

// Get contacts by member ID (for user to view their requests)
async function listContactsByMember(memberId, { limit = 50, offset = 0 } = {}) {
  if (!isUuid(memberId)) {
    throw new AppError({
      statusCode: 400,
      code: "CONTACT_INVALID_MEMBER_ID",
      message: "invalid member id",
    });
  }

  const { rows, count } = await Contact.findAndCountAll({
    where: { memberId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { items: rows, total: count };
}

// Admin reply to contact
async function replyToContact(id, { adminReply, handledBy }) {
  const doc = await getContactById(id);

  await doc.update({
    adminReply,
    repliedAt: new Date(),
    handledBy,
    handledAt: new Date(),
    status: "resolved",
  });

  return doc;
}

module.exports = {
  createContact,
  listContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  countByStatus,
  listContactsByMember,
  replyToContact,
};
