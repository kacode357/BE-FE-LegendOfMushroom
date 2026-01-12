# Deploy BE on Render

This backend uses PostgreSQL via Sequelize.

## 1) Create a Web Service

- Root Directory: `BE_CrawlData_FPT`
- Build Command: `npm install`
- Start Command: `node src/server.js`

Render will provide `PORT` automatically.

## 2) Database

Use one of the following:

### Option A: Render Postgres (recommended)

- Create a Render Postgres instance
- Copy the `External Database URL` into `DATABASE_URL`
- If your DB requires SSL, set `DB_SSL=true`

### Option B: External Postgres (RDS, Neon, etc)

Set either `DATABASE_URL` or `DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD`.

## 3) Required environment variables (Render Dashboard)

- `NODE_ENV=production`
- `JWT_SECRET` (required)
- `AUTH_COOKIE_SECRET` (>= 16 chars, required)
- `CORS_ORIGIN` (your FE URL)

Optional:
- `SWAGGER_UI_ENABLED=false`
- `DB_SSL=true`

## 4) Notes

- Schema is created on boot via `sequelize.sync()`.
- Keep `DB_RESET_ON_START=false` in production.
