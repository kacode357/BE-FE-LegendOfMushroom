const express = require("express");
const { createCode, verify, getUsers } = require("./access.controller");
const { authenticateAny } = require("../../middleware/authAny");
const { authorizeRoles } = require("../../middleware/auth");

const router = express.Router();

/**
 * @openapi
 * /api/access/codes:
 *   post:
 *     tags:
 *       - Access
 *     summary: Admin creates a short-lived access code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ttlMinutes:
 *                 type: number
 *                 example: 5
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
 *                   type: object
 *                   properties:
 *                     code: { type: string, example: "ABCD1234" }
 *                     expiresAt: { type: string, format: date-time }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/codes", authenticateAny, authorizeRoles("admin"), createCode);

/**
 * @openapi
 * /api/access/users:
 *   get:
 *     tags:
 *       - Access
 *     summary: Admin gets list of registered users
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           code: { type: string }
 *                           package:
 *                             type: object
 *                             properties:
 *                               id: { type: string, nullable: true }
 *                               name: { type: string, nullable: true }
 *                           usedAt: { type: string, format: date-time }
 *                           lastAccessAt: { type: string, format: date-time, nullable: true }
 *                           createdAt: { type: string, format: date-time }
 *                           user:
 *                             type: object
 *                             properties:
 *                               uid: { type: string }
 *                               name: { type: string }
 *                               server: { type: string }
 *                               avatarUrl: { type: string }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/users", authenticateAny, authorizeRoles("admin"), getUsers);

/**
 * @openapi
 * /api/access/verify:
 *   post:
 *     tags:
 *       - Access
 *     summary: Register (first time) or verify access (later)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, name, uid, server, avatarUrl, packageId]
 *             properties:
 *               code: { type: string, example: "ABCD1234" }
 *               name: { type: string, example: "Alice" }
 *               uid: { type: string, example: "u1" }
 *               server: { type: string, example: "sv1" }
 *               avatarUrl: { type: string, example: "https://example.com/a.png" }
 *               packageId: { type: string, example: "65a0c9e9e8a5f0f9b5c2d111" }
 *     responses:
 *       200:
 *         description: Allowed or Registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 status: { type: number, example: 200 }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     status: { type: string, example: "allowed" }
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Code already used by another user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Invalid code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       410:
 *         description: Code expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post("/verify", verify);

module.exports = router;
