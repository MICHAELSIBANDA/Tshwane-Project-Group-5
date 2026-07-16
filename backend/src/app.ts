import express, {
  type Express,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import databaseRouter from "./routes/database.routes.js";
import authRouter from "./routes/auth.routes.js";
import cardRouter from "./routes/card.routes.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/api/cards", cardRouter);
app.use("/api/auth", authRouter);
app.use(express.urlencoded({ extended: true }));
app.use("/api/database", databaseRouter);

app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({
    success: true,
    message: "Tshwane Bus Service API is running",
    timestamp: new Date().toISOString(),
  });
});


export default app;