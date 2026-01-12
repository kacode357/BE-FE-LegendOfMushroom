const express = require("express");
const { authenticateAny } = require("../../middleware/authAny");
const { authorizeRoles } = require("../../middleware/auth");
const { create, list, get, patch, remove } = require("./package.controller");

const router = express.Router();

/**
 * @openapi
 * /api/packages:
 *   get:
 *     tags:
 *       - Packages
 *     summary: List packages
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
 *                           name: { type: string }
 *                           description: { type: string }
 *                           fileUrl: { type: string }
 *             examples:
 *               success:
 *                 summary: Danh sách gói thành công
 *                 value:
 *                   success: true
 *                   status: 200
 *                   message: "ok"
 *                   data:
 *                     items:
 *                       - id: "1"
 *                         name: "Gói Premium"
 *                         description: "Gói cao cấp với nhiều tính năng"
 *                         fileUrl: "https://example.com/premium.zip"
 *                       - id: "2"
 *                         name: "Gói Basic"
 *                         description: "Gói cơ bản"
 *                         fileUrl: "https://example.com/basic.zip"
 */
router.get("/", list);

/**
 * @openapi
 * /api/packages/{id}:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Get package by id
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
 * /api/packages:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Admin creates package
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: "Gói A" }
 *               description: { type: string, example: "Mô tả" }
 *               fileUrl: { type: string, example: "https://example.com/file.zip" }
 *     responses:
 *       200:
 *         description: Created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticateAny, authorizeRoles("admin"), create);

/**
 * @openapi
 * /api/packages/{id}:
 *   patch:
 *     tags:
 *       - Packages
 *     summary: Admin updates package
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
 *               name: { type: string }
 *               description: { type: string }
 *               fileUrl: { type: string }
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/:id", authenticateAny, authorizeRoles("admin"), patch);

/**
 * @openapi
 * /api/packages/{id}:
 *   delete:
 *     tags:
 *       - Packages
 *     summary: Admin deletes package
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
 */
router.delete("/:id", authenticateAny, authorizeRoles("admin"), remove);

module.exports = router;
