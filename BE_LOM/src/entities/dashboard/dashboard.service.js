const Package = require("../package/package.model");
const AccessCode = require("../access/access.model");
const Contact = require("../contact/contact.model");
const Member = require("../member/member.model");
const User = require("../user/user.model");
const Notification = require("../notification/notification.model");
const { Op } = require("sequelize");

async function getDashboardStats() {
  const now = new Date();
  
  // Get counts in parallel
  const [
    totalPackages,
    totalAccessCodes,
    activeAccessCodes,
    usedAccessCodes,
    expiredAccessCodes,
    totalMembers,
    verifiedMembers,
    totalContacts,
    pendingContacts,
    processingContacts,
    resolvedContacts,
    totalAdmins,
    totalNotifications,
  ] = await Promise.all([
    // Packages
    Package.count(),
    
    // Access codes - based on usedAt and expiresAt columns
    AccessCode.count(),
    // Active: not used AND (no expiry OR not expired yet)
    AccessCode.count({ 
      where: { 
        usedAt: null,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: now } }
        ]
      } 
    }),
    // Used: has usedAt date
    AccessCode.count({ where: { usedAt: { [Op.ne]: null } } }),
    // Expired: not used AND has expiry AND expiry passed
    AccessCode.count({ 
      where: { 
        usedAt: null,
        expiresAt: { [Op.ne]: null, [Op.lte]: now }
      } 
    }),
    
    // Members
    Member.count(),
    Member.count({ where: { isVerified: true } }),
    
    // Contacts
    Contact.count(),
    Contact.count({ where: { status: "pending" } }),
    Contact.count({ where: { status: "processing" } }),
    Contact.count({ where: { status: "resolved" } }),
    
    // Admins
    User.count(),
    
    // Notifications
    Notification.count(),
  ]);

  return {
    packages: {
      total: totalPackages,
    },
    accessCodes: {
      total: totalAccessCodes,
      active: activeAccessCodes,
      used: usedAccessCodes,
      expired: expiredAccessCodes,
    },
    members: {
      total: totalMembers,
      verified: verifiedMembers,
      unverified: totalMembers - verifiedMembers,
    },
    contacts: {
      total: totalContacts,
      pending: pendingContacts,
      processing: processingContacts,
      resolved: resolvedContacts,
    },
    admins: {
      total: totalAdmins,
    },
    notifications: {
      total: totalNotifications,
    },
  };
}

async function getRecentActivity() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get recent data in parallel
  const [recentContacts, recentMembers, recentAccessCodes] = await Promise.all([
    Contact.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "name", "subject", "status", "createdAt"],
    }),
    Member.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "email", "isVerified", "createdAt"],
    }),
    AccessCode.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      order: [["createdAt", "DESC"]],
      limit: 5,
      attributes: ["id", "code", "usedAt", "expiresAt", "createdAt"],
    }),
  ]);

  // Helper to compute status from usedAt/expiresAt
  const getAccessCodeStatus = (usedAt, expiresAt) => {
    if (usedAt) return "used";
    if (expiresAt && new Date(expiresAt) <= new Date()) return "expired";
    return "active";
  };

  return {
    recentContacts: recentContacts.map((c) => ({
      id: String(c.id),
      name: c.name,
      subject: c.subject,
      status: c.status,
      createdAt: c.createdAt,
    })),
    recentMembers: recentMembers.map((m) => ({
      id: String(m.id),
      email: m.email,
      isVerified: m.isVerified,
      createdAt: m.createdAt,
    })),
    recentAccessCodes: recentAccessCodes.map((a) => ({
      id: String(a.id),
      code: a.code,
      status: getAccessCodeStatus(a.usedAt, a.expiresAt),
      createdAt: a.createdAt,
    })),
  };
}

module.exports = {
  getDashboardStats,
  getRecentActivity,
};
