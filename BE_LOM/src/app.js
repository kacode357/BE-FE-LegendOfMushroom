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

// Allow all origins - no CORS restrictions
app.use(
  cors({
    origin: true,
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
  // Serve custom JS to force light mode BEFORE swagger UI
  app.get('/swagger-custom.js', (req, res) => {
    res.type('application/javascript');
    res.send(`
      (function() {
        // Clear dark mode from localStorage
        localStorage.removeItem('theme');
        localStorage.removeItem('swagger-ui-theme');
        localStorage.setItem('theme', 'light');
        
        // Wait for Swagger UI to load and force light mode
        const forceLight = setInterval(function() {
          const html = document.documentElement;
          const body = document.body;
          
          if (html && html.getAttribute('data-theme') === 'dark') {
            html.removeAttribute('data-theme');
            html.setAttribute('data-theme', 'light');
          }
          if (body && body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            body.setAttribute('data-theme', 'light');
          }
          
          // Find and click dark mode toggle if still in dark mode
          const toggleButtons = document.querySelectorAll('button');
          for (let btn of toggleButtons) {
            const title = btn.getAttribute('title') || '';
            if (title.toLowerCase().includes('dark') && html.getAttribute('data-theme') === 'dark') {
              btn.click();
              clearInterval(forceLight);
              break;
            }
          }
        }, 100);
        
        // Stop checking after 5 seconds
        setTimeout(() => clearInterval(forceLight), 5000);
      })();
    `);
  });
  
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "LOM API Docs",
    customCss: `
      /* Hide dark mode toggle button */
      .swagger-ui .dark-mode-toggle { display: none !important; }
      button[title*="dark mode"] { display: none !important; }
      button[title*="Dark mode"] { display: none !important; }
    `,
    customJsStr: `
      localStorage.removeItem('theme');
      localStorage.setItem('theme', 'light');
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
      }
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
