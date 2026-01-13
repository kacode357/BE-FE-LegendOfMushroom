const express = require("express");
const { authenticateAny } = require("../../middleware/authAny");
const { authorizeRoles } = require("../../middleware/auth");
const { authenticateMember } = require("../../middleware/authMember");
const { create, list, get, patch, remove, stats, myContacts, reply } = require("./contact.controller");

const router = express.Router();

/**
 * @openapi
 * /api/contacts:
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Submit a contact/support request (member auth required)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *               subject:
 *                 type: string
 *                 example: "Hỗ trợ cài đặt game"
 *               message:
 *                 type: string
 *                 example: "Tôi gặp lỗi khi cài đặt game..."
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "created" }
 *                 data:
 *                   $ref: "#/components/schemas/Contact"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized - Login required
 */
router.post("/", authenticateMember, create);

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: List all contact requests (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, resolved, closed]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
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
 *                         $ref: "#/components/schemas/Contact"
 *                     total:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/", authenticateAny, authorizeRoles("admin"), list);

/**
 * @openapi
 * /api/contacts/stats:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get contact statistics by status (admin only)
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
 *                 success: { type: boolean, example: true }
 *                 status: { type: number, example: 200 }
 *                 message: { type: string, example: "ok" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending: { type: integer, example: 5 }
 *                     processing: { type: integer, example: 2 }
 *                     resolved: { type: integer, example: 10 }
 *                     closed: { type: integer, example: 3 }
 *                     total: { type: integer, example: 20 }
 */
router.get("/stats", authenticateAny, authorizeRoles("admin"), stats);

/**
 * @openapi
 * /api/contacts/my:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get my contact requests (member auth required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized
 */
router.get("/my", authenticateMember, myContacts);

/**
 * @openapi
 * /api/contacts/{id}:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Get a contact request by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         description: Not found
 */
router.get("/:id", authenticateAny, authorizeRoles("admin"), get);

/**
 * @openapi
 * /api/contacts/{id}:
 *   patch:
 *     tags:
 *       - Contacts
 *     summary: Update contact status (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, resolved, closed]
 *               adminNote:
 *                 type: string
 *                 example: "Đã hỗ trợ qua Telegram"
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not found
 */
router.patch("/:id", authenticateAny, authorizeRoles("admin"), patch);

/**
 * @openapi
 * /api/contacts/{id}:
 *   delete:
 *     tags:
 *       - Contacts
 *     summary: Delete a contact request (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router.delete("/:id", authenticateAny, authorizeRoles("admin"), remove);

/**
 * @openapi
 * /api/contacts/{id}/reply:
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Reply to a contact request (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adminReply
 *             properties:
 *               adminReply:
 *                 type: string
 *                 example: "Chào bạn, vấn đề của bạn đã được xử lý..."
 *     responses:
 *       200:
 *         description: Replied
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not found
 */
router.post("/:id/reply", authenticateAny, authorizeRoles("admin"), reply);

/**
 * @openapi
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         subject:
 *           type: string
 *         message:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, processing, resolved, closed]
 *         adminNote:
 *           type: string
 *           nullable: true
 *         handledBy:
 *           type: string
 *           nullable: true
 *         handledAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

module.exports = router;
