const express = require("express");
const { authenticateAny } = require("../../middleware/authAny");
const { authorizeRoles } = require("../../middleware/auth");
const { stats, recent } = require("./dashboard.controller");

const router = express.Router();

/**
 * @openapi
 * /api/dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get dashboard statistics (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     packages:
 *                       type: object
 *                     accessCodes:
 *                       type: object
 *                     members:
 *                       type: object
 *                     contacts:
 *                       type: object
 *                     admins:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/stats", authenticateAny, authorizeRoles("admin"), stats);

/**
 * @openapi
 * /api/dashboard/recent:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get recent activity (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     recentContacts:
 *                       type: array
 *                     recentMembers:
 *                       type: array
 *                     recentAccessCodes:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/recent", authenticateAny, authorizeRoles("admin"), recent);

module.exports = router;
