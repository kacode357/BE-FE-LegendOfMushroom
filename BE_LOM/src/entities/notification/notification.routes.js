const express = require("express");
const { authenticateAny } = require("../../middleware/authAny");
const { authorizeRoles } = require("../../middleware/auth");
const { create, list, listByPackage, get, patch, remove } = require("./notification.controller");

const router = express.Router();

/**
 * @openapi
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: List all notifications
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "ok" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           packageId: { type: string }
 *                           title: { type: string }
 *                           content: { type: string }
 *                           createdBy: { type: string }
 *                           createdAt: { type: string }
 *                           updatedAt: { type: string }
 */
router.get("/", list);

/**
 * @openapi
 * /api/notifications/package/{packageId}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: List notifications by package ID
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Invalid package ID
 */
router.get("/package/:packageId", listByPackage);

/**
 * @openapi
 * /api/notifications/{id}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get("/:id", get);

/**
 * @openapi
 * /api/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Admin creates notification for a package
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [packageId, title]
 *             properties:
 *               packageId: { type: string, example: "uuid-of-package" }
 *               title: { type: string, example: "Thông báo mới" }
 *               content: { type: string, example: "Nội dung thông báo" }
 *     responses:
 *       200:
 *         description: Created
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Package not found
 */
router.post("/", authenticateAny, authorizeRoles("admin"), create);

/**
 * @openapi
 * /api/notifications/{id}:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Admin updates notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch("/:id", authenticateAny, authorizeRoles("admin"), patch);

/**
 * @openapi
 * /api/notifications/{id}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Admin deletes notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete("/:id", authenticateAny, authorizeRoles("admin"), remove);

module.exports = router;
