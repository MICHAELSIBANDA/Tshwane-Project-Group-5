import { Router, type Request, type Response } from "express";
import { prisma } from "../config/prisma.js";

const databaseRouter = Router();

databaseRouter.get(
  "/health",
  async (_request: Request, response: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      return response.status(200).json({
        success: true,
        message: "PostgreSQL database connection is working",
        database: "tshwane_bus_service",
      });
    } catch (error) {
      console.error("Database connection error:", error);

      return response.status(500).json({
        success: false,
        message: "Unable to connect to the PostgreSQL database",
      });
    }
  },
);

export default databaseRouter;