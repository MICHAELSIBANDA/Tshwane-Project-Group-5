import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/prisma.js";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`Tshwane Bus Service API running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Database health check: http://localhost:${port}/api/database/health`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Closing server...`);

  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log("Database connection closed.");
      console.log("Server closed successfully.");
      process.exit(0);
    } catch (error) {
      console.error("Error occurred while shutting down:", error);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));