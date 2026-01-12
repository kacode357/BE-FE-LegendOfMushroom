# BE deploy on AWS (ap-southeast-1)

This backend now uses **PostgreSQL** via **Sequelize** (no MongoDB).

## 1) Create PostgreSQL on AWS

Recommended: **Amazon RDS for PostgreSQL** in region `ap-southeast-1`.

- Create a database and keep: host, port, db name, username, password.
- Security Group: allow inbound from your compute (ECS/EC2/EB) on port `5432`.
- If you enable RDS "require SSL", set `DB_SSL=true`.

## 2) Configure environment variables

Use either `DATABASE_URL` or separate `DB_*` variables.

Region:
- `AWS_REGION=ap-southeast-1`

Credentials:
- Do NOT hardcode or commit AWS access keys.
- Prefer IAM Roles (ECS Task Role / EC2 Instance Profile / Beanstalk instance role) or inject secrets via your platform's environment variables.

Required for app auth:
- `JWT_SECRET`
- `AUTH_COOKIE_SECRET` (>= 16 chars)

Optional:
- `SWAGGER_UI_ENABLED=true`
- `CORS_ORIGIN=https://your-frontend-domain` (comma-separated allowed)

## 3) Deploy options

### Option A: ECS / EC2 / any Docker host

Build & run:
- `docker build -t crawldata-be .`
- `docker run -p 3000:3000 --env-file .env crawldata-be`

Health check endpoint:
- `GET /health`

### Option B: Elastic Beanstalk (Docker)

You can use the provided `Dockerfile`. Create an EB environment in `ap-southeast-1` and set env vars in EB configuration.

## Notes

- Tables are created automatically on boot (`sequelize.sync()`).
- `DB_RESET_ON_START=true` will drop tables on startup (do NOT use in production).
