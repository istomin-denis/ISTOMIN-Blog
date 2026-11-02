import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT || 4000);
async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters");
  }
  await connectDatabase(process.env.MONGODB_URI);
  app.listen(port, () => console.log(`ISTOMIN Blog API listening on port ${port}`));
}
start().catch((error) => {
  console.error("Failed to start API:", error.message);
  process.exit(1);
});
