import { Router } from "express";
import { getCurrentUserController, loginController, registerPassengerController } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/login",
  loginController
);

authRouter.post(
  "/register",
  registerPassengerController,
);

authRouter.get(
    "/me",
    authenticate,
    getCurrentUserController,
);
export default authRouter;