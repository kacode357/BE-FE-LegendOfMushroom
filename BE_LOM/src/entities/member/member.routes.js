const express = require("express");
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  resendVerification,
} = require("./member.controller");
const { authenticateMember } = require("../../middleware/authMember");

const router = express.Router();

/**
 * @openapi
 * /api/members/register:
 *   post:
 *     tags:
 *       - Members
 *     summary: Register new member account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       200:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post("/register", register);

/**
 * @openapi
 * /api/members/verify-email:
 *   post:
 *     tags:
 *       - Members
 *     summary: Verify email with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post("/verify-email", verifyEmail);

/**
 * @openapi
 * /api/members/resend-verification:
 *   post:
 *     tags:
 *       - Members
 *     summary: Resend verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent if account exists
 */
router.post("/resend-verification", resendVerification);

/**
 * @openapi
 * /api/members/login:
 *   post:
 *     tags:
 *       - Members
 *     summary: Member login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         email: { type: string }
 *                         name: { type: string }
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not verified or inactive
 */
router.post("/login", login);

/**
 * @openapi
 * /api/members/forgot-password:
 *   post:
 *     tags:
 *       - Members
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent if account exists
 */
router.post("/forgot-password", forgotPassword);

/**
 * @openapi
 * /api/members/reset-password:
 *   post:
 *     tags:
 *       - Members
 *     summary: Reset password with token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
router.post("/reset-password", resetPassword);

/**
 * @openapi
 * /api/members/profile:
 *   get:
 *     tags:
 *       - Members
 *     summary: Get current member profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticateMember, getProfile);

module.exports = router;
