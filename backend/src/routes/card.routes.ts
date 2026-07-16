import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getMyCardsController,
  linkBusCardController,
  topUpBusCardController,
} from "../controllers/card.controller.js";

const cardRouter = Router();

cardRouter.use(authenticate);

cardRouter.post("/link", linkBusCardController);
cardRouter.get("/my-cards", getMyCardsController);

cardRouter.post(
  "/:cardId/top-up",
  topUpBusCardController,
);

export default cardRouter;