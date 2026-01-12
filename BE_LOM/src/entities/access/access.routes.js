const express = require("express");
const { createCode, verify, checkAccess, getUsers } = require("./access.controller");
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
 *             examples:
 *               success:
 *                 summary: Tạo mã truy cập thành công
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "created"
 *                   data:
 *                     code: "ABCD1234"
 *                     expiresAt: "2026-01-12T10:30:00Z"
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
 *             examples:
 *               success:
 *                 summary: Danh sách người dùng đã đăng ký
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "ok"
 *                   data:
 *                     items:
 *                       - code: "ABCD1234"
 *                         package:
 *                           id: "1"
 *                           name: "Gói Premium"
 *                         usedAt: "2026-01-12T09:00:00Z"
 *                         lastAccessAt: "2026-01-12T09:30:00Z"
 *                         createdAt: "2026-01-12T08:00:00Z"
 *                         user:
 *                           uid: "user123"
 *                           name: "Nguyễn Văn A"
 *                           server: "S1"
 *                           avatarUrl: "https://example.com/avatar.jpg"
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
 *             examples:
 *               firstTime:
 *                 summary: Đăng ký lần đầu thành công
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "registered"
 *                   data:
 *                     status: "registered"
 *               alreadyRegistered:
 *                 summary: Đã đăng ký trước đó
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "allowed"
 *                   data:
 *                     status: "allowed"
 *       400:
 *         description: Missing fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               missingFields:
 *                 summary: Thiếu thông tin
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "missing required fields"
 *                   code: "MISSING_FIELDS"
 *       403:
 *         description: Code already used by another user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               codeUsed:
 *                 summary: Mã đã được sử dụng
 *                 value:
 *                   success: false
 *                   status: 403
 *                   message: "code already used by another user"
 *                   code: "CODE_ALREADY_USED"
 *       404:
 *         description: Invalid code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               codeNotFound:
 *                 summary: Mã không tồn tại
 *                 value:
 *                   success: false
 *                   status: 404
 *                   message: "code not found"
 *                   code: "CODE_NOT_FOUND"
 *       410:
 *         description: Code expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               codeExpired:
 *                 summary: Mã hết hạn
 *                 value:
 *                   success: false
 *                   status: 410
 *                   message: "code expired"
 *                   code: "CODE_EXPIRED"
 */
router.post("/verify", verify);

/**
 * @openapi
 * /api/access/check:
 *   post:
 *     tags:
 *       - Access
 *     summary: Check user access by uid, server and packageId
 *     description: Verify if user has access to a specific package. Optional name and avatarUrl will be updated if provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [uid, server, packageId]
 *             properties:
 *               uid: { type: string, example: "user123" }
 *               server: { type: string, example: "S1" }
 *               packageId: { type: string, example: "65a0c9e9-e8a5-f0f9-b5c2-d11100000001", description: "Package ID to check access for" }
 *               name: { type: string, example: "Nguyễn Văn A", description: "Optional - will update if provided" }
 *               avatarUrl: { type: string, example: "https://example.com/avatar.jpg", description: "Optional - will update if provided" }
 *     responses:
 *       200:
 *         description: Access granted
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
 *                     allowed: { type: boolean, example: true }
 *                     package:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         name: { type: string }
 *             examples:
 *               success:
 *                 summary: Có quyền truy cập
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "access granted"
 *                   data:
 *                     allowed: true
 *                     package:
 *                       id: "65a0c9e9-e8a5-f0f9-b5c2-d11100000001"
 *                       name: "Gói Premium"
 *       400:
 *         description: Missing required fields or invalid packageId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               missingFields:
 *                 summary: Thiếu thông tin bắt buộc
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "uid, server and packageId are required"
 *                   code: "ACCESS_MISSING_FIELDS"
 *               invalidPackageId:
 *                 summary: PackageId không hợp lệ
 *                 value:
 *                   success: false
 *                   status: 400
 *                   message: "invalid packageId"
 *                   code: "ACCESS_INVALID_PACKAGE_ID"
 *       404:
 *         description: No access found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               notFound:
 *                 summary: Không tìm thấy quyền truy cập cho gói này
 *                 value:
 *                   success: false
 *                   status: 404
 *                   message: "no access found for this user with this package"
 *                   code: "ACCESS_NOT_FOUND"
 */
router.post("/check", checkAccess);

module.exports = router;
