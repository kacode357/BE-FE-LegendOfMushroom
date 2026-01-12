const path = require("path");
const swaggerJSDoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 8080;

const definition = {
  openapi: "3.0.3",
  info: {
    title: "CrawlData FPT API",
    version: "1.0.0",
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
    },
  ],
  tags: [{ name: "Health" }, { name: "Auth" }, { name: "Access" }, { name: "Packages" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 1 },
        },
      },
      User: {
        type: "object",
        required: ["id", "email", "name", "role"],
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          name: { type: "string" },
          role: { type: "string" },
        },
      },
      LoginData: {
        type: "object",
        required: ["token", "user"],
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      LoginSuccessResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", example: true },
          status: { type: "number", example: 200 },
          message: { type: "string", example: "login success" },
          data: { $ref: "#/components/schemas/LoginData" },
        },
      },
      LogoutSuccessResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", example: true },
          status: { type: "number", example: 200 },
          message: { type: "string", example: "logout success" },
          data: { nullable: true },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "message", "code"],
        properties: {
          success: { type: "boolean", example: false },
          status: { type: "number", example: 400 },
          message: { type: "string" },
          code: { type: "string" },
          errors: { nullable: true },
        },
      },
    },
  },
};

const apis = [
  path.join(__dirname, "..", "app.js"),
  path.join(__dirname, "..", "entities", "**", "*.routes.js"),
];

module.exports = swaggerJSDoc({ definition, apis });
