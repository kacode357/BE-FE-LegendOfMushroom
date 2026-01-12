// Bootstrap: load env and start the HTTP server.
require("dotenv").config();

const app = require("./app");
const { initDatabase } = require("./db/init");

const PORT = process.env.PORT || 3000;
// Connect to Postgres, seed admin user, then listen on PORT.
async function start() {
  try {
    await initDatabase();
    const { ensureAdminUser } = require("./entities/user/adminSeeder");
    await ensureAdminUser();
  } catch (err) {
    const allowStartWithoutDb =
      String(process.env.ALLOW_START_WITHOUT_DB || "")
        .trim()
        .toLowerCase() === "true";
    if (!allowStartWithoutDb) {
      throw err;
    }

    console.warn(
      "DB init failed but ALLOW_START_WITHOUT_DB=true, continuing without DB:",
      err && err.message ? err.message : err
    );
  }

  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);

    const checkAwsOnStart =
      String(process.env.CHECK_AWS_ON_START || "")
        .trim()
        .toLowerCase() === "true";
    if (checkAwsOnStart) {
      // Fire-and-forget check; log result for quick verification.
      Promise.resolve()
        .then(async () => {
          const { describeConfiguredTable } = require("./aws/dynamodb");
          const dynamodb = await describeConfiguredTable();
          console.log("DynamoDB connectivity:", { ok: true, ...dynamodb });
        })
        .catch((err) => {
          console.log("DynamoDB connectivity:", {
            ok: false,
            error: err && err.name ? err.name : "Error",
            message: err && err.message ? err.message : String(err),
          });
        });
    }
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
