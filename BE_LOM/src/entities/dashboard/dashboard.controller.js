const { sendSuccess } = require("../../utils/response");
const { getDashboardStats, getRecentActivity } = require("./dashboard.service");

async function stats(req, res, next) {
  try {
    const data = await getDashboardStats();
    return sendSuccess(res, {
      message: "ok",
      data,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return next(err);
  }
}

async function recent(req, res, next) {
  try {
    const data = await getRecentActivity();
    return sendSuccess(res, {
      message: "ok",
      data,
    });
  } catch (err) {
    console.error("Dashboard recent error:", err);
    return next(err);
  }
}

module.exports = {
  stats,
  recent,
};
