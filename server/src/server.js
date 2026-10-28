require("dotenv").config();
const connectDatabase = require("./config/db");
const app = require("./app");

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
  }
  await connectDatabase();
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`WriteSphere API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error("Could not start WriteSphere:", error.message);
  process.exitCode = 1;
});
