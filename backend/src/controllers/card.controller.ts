import type { Request, Response } from "express";

import {
  linkBusCardSchema,
  topUpCardSchema,
} from "../validators/card.validator.js";

import {
  getPassengerCards,
  linkBusCard,
  topUpBusCard,
} from "../services/card.service.js";

/**
 * Links a physical Tshwane Bus Service card
 * to the authenticated passenger's account.
 */
export async function linkBusCardController(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.auth) {
    response.status(401).json({
      success: false,
      message: "Authentication is required",
    });

    return;
  }

  const validationResult = linkBusCardSchema.safeParse(
    request.body,
  );

  if (!validationResult.success) {
    response.status(400).json({
      success: false,
      message: "The bus card information is invalid",
      errors: validationResult.error.flatten().fieldErrors,
    });

    return;
  }

  try {
    const card = await linkBusCard(
      request.auth.userId,
      validationResult.data,
    );

    response.status(201).json({
      success: true,
      message: "Bus card linked successfully",
      data: {
        card,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CARD_ALREADY_LINKED"
    ) {
      response.status(409).json({
        success: false,
        message: "This bus card is already linked",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "PASSENGER_PROFILE_NOT_FOUND"
    ) {
      response.status(403).json({
        success: false,
        message: "Only passenger accounts can link bus cards",
      });

      return;
    }

    console.error("Link bus card error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to link the bus card",
    });
  }
}

/**
 * Returns all bus cards linked to the
 * authenticated passenger's account.
 */
export async function getMyCardsController(
  request: Request,
  response: Response,
): Promise<void> {
  if (!request.auth) {
    response.status(401).json({
      success: false,
      message: "Authentication is required",
    });

    return;
  }

  try {
    const cards = await getPassengerCards(
      request.auth.userId,
    );

    response.status(200).json({
      success: true,
      message: "Bus cards retrieved successfully",
      data: {
        cards,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PASSENGER_PROFILE_NOT_FOUND"
    ) {
      response.status(403).json({
        success: false,
        message: "Only passenger accounts can view bus cards",
      });

      return;
    }

    console.error("Get passenger cards error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to retrieve bus cards",
    });
  }
}

export async function topUpBusCardController(
  request: Request<{ cardId: string }>,
  response: Response,
): Promise<void> {
  if (!request.auth) {
    response.status(401).json({
      success: false,
      message: "Authentication is required",
    });

    return;
  }

  const userId = request.auth.userId;
  const cardId = request.params.cardId;

  if (!cardId) {
    response.status(400).json({
      success: false,
      message: "Card ID is required",
    });

    return;
  }

  const validationResult = topUpCardSchema.safeParse(
    request.body,
  );

  if (!validationResult.success) {
    response.status(400).json({
      success: false,
      message: "The top-up information is invalid",
      errors: validationResult.error.flatten().fieldErrors,
    });

    return;
  }

  try {
    const result = await topUpBusCard(
      userId,
      cardId,
      validationResult.data,
    );

    response.status(200).json({
      success: true,
      message: "Bus card top-up completed successfully",
      paymentMethod: "SIMULATED_PAYMENT",
      data: result,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "CARD_NOT_FOUND"
    ) {
      response.status(404).json({
        success: false,
        message:
          "The bus card was not found or does not belong to this passenger",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "CARD_NOT_ACTIVE"
    ) {
      response.status(400).json({
        success: false,
        message: "Only active bus cards can be topped up",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "PASSENGER_PROFILE_NOT_FOUND"
    ) {
      response.status(403).json({
        success: false,
        message: "Only passenger accounts can top up bus cards",
      });

      return;
    }

    console.error("Bus card top-up error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to complete the bus card top-up",
    });
  }
}