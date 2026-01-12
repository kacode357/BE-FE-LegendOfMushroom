// Express app wiring (routes, middleware, swagger, error handling).
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");
const { isAppError } = require("./utils/appError");
const { sendError } = require("./utils/response");
const MESSAGES = require("./constants/messages");
const { describeConfiguredTable } = require("./aws/dynamodb");

const app = express();
const diagnosticsMode =
  String(process.env.ALLOW_START_WITHOUT_DB || "")
    .trim()
    .toLowerCase() === "true";
// Toggle Swagger UI with SWAGGER_UI_ENABLED=true/false.
const isSwaggerEnabled =
  String(process.env.SWAGGER_UI_ENABLED || "").toLowerCase() === "true";

const corsOrigins = String(process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *               required:
 *                 - status
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/aws", async (req, res) => {
  try {
    const dynamodb = await describeConfiguredTable();
    return res.json({ status: "ok", dynamodb: { ok: true, ...dynamodb } });
  } catch (err) {
    return res.json({
      status: "ok",
      dynamodb: {
        ok: false,
        enabled: true,
        error: err && err.name ? err.name : "Error",
        message: err && err.message ? err.message : String(err),
      },
    });
  }
});

if (!diagnosticsMode) {
  const authRoutes = require("./entities/auth/auth.routes");
  const accessRoutes = require("./entities/access/access.routes");
  const packageRoutes = require("./entities/package/package.routes");

  app.use("/api/auth", authRoutes);
  app.use("/api/access", accessRoutes);
  app.use("/api/packages", packageRoutes);
} else {
  console.warn(
    "Diagnostics mode enabled (ALLOW_START_WITHOUT_DB=true): skipping /api routes that require DB"
  );
}
if (isSwaggerEnabled) {
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "LOM API Docs",
    customCss: `
      .swagger-ui { background: #fff !important; }
      .swagger-ui .scheme-container { background: #fff !important; }
      .swagger-ui .topbar { background: #89bf04 !important; }
      .swagger-ui .btn { background: transparent !important; }
      .swagger-ui .opblock .opblock-summary { background: rgba(0,0,0,.05) !important; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90 !important; background: rgba(73,204,144,.1) !important; }
      .swagger-ui .opblock.opblock-get { border-color: #61affe !important; background: rgba(97,175,254,.1) !important; }
      .swagger-ui .opblock.opblock-put { border-color: #fca130 !important; background: rgba(252,161,48,.1) !important; }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e !important; background: rgba(249,62,62,.1) !important; }
      /* Hide dark mode toggle button */
      .swagger-ui .dark-mode-toggle { display: none !important; }
      button[title*="dark mode"] { display: none !important; }
      button[title*="Dark mode"] { display: none !important; }
    `,
  }));
} else {
  app.get("/", (req, res) => {
    res.json({ status: "ok", message: "api is running" });
  });
}

// Centralized error handler.
app.use((err, req, res, next) => {
  if (isAppError(err)) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      errors: err.details,
    });
  }

  return sendError(res, {
    statusCode: 500,
    message: MESSAGES.SERVER.ERROR,
    code: "SERVER_ERROR",
  });
});

module.exports = app;
