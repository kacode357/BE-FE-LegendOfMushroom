// Auth route definitions.
const express = require("express");
const { login, logout } = require("./auth.controller");

const router = express.Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *           examples:
 *             default:
 *               value:
 *                 email: admin@example.com
 *                 password: your_password
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginSuccessResponse"
 *             examples:
 *               success:
 *                 summary: Đăng nhập thành công
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "login success"
 *                   data:
 *                     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       id: "1"
 *                       email: "admin@local"
 *                       name: "Admin"
 *                       role: "admin"
 *       400:
 *         description: Missing credentials
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
 *                   message: "email and password are required"
 *                   code: "MISSING_FIELDS"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               invalidCredentials:
 *                 summary: Sai email hoặc mật khẩu
 *                 value:
 *                   success: false
 *                   status: 401
 *                   message: "invalid credentials"
 *                   code: "INVALID_CREDENTIALS"
 */
router.post("/login", login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LogoutSuccessResponse"
 *             examples:
 *               success:
 *                 summary: Đăng xuất thành công
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "logout success"
 *                   data: null
 *       401:
 *         description: Missing or invalid token
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
router.post("/logout", logout);

module.exports = router;
