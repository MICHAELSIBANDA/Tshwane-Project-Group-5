import { randomUUID } from "node:crypto";
import { prisma } from "../config/prisma.js";
import type {
  LinkBusCardInput,
  TopUpCardInput,
} from "../validators/card.validator.js";

async function findPassengerProfile(userId: string) {
  const passengerProfile =
    await prisma.passengerProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!passengerProfile) {
    throw new Error("PASSENGER_PROFILE_NOT_FOUND");
  }

  return passengerProfile;
}

export async function linkBusCard(
  userId: string,
  input: LinkBusCardInput,
) {
  const passengerProfile =
    await findPassengerProfile(userId);

  const cardNumber = input.cardNumber.toUpperCase();

  const existingCard = await prisma.busCard.findUnique({
    where: {
      cardNumber,
    },
  });

  if (existingCard) {
    throw new Error("CARD_ALREADY_LINKED");
  }

  const card = await prisma.busCard.create({
    data: {
      cardNumber,
      cardToken: randomUUID(),
      passengerId: passengerProfile.id,
      balance: 0,
    },

    select: {
      id: true,
      cardNumber: true,
      balance: true,
      status: true,
      issuedAt: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return {
    ...card,
    balance: card.balance.toFixed(2),
  };
}

export async function getPassengerCards(
  userId: string,
) {
  const passengerProfile =
    await findPassengerProfile(userId);

  const cards = await prisma.busCard.findMany({
    where: {
      passengerId: passengerProfile.id,
    },

    select: {
      id: true,
      cardNumber: true,
      balance: true,
      status: true,
      issuedAt: true,
      expiresAt: true,
      blockedAt: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return cards.map((card) => ({
    ...card,
    balance: card.balance.toFixed(2),
  }));
}

export async function topUpBusCard(
  userId: string,
  cardId: string,
  input: TopUpCardInput,
) {
  const passengerProfile =
    await findPassengerProfile(userId);

  const result = await prisma.$transaction(
    async (transactionClient) => {
      const card =
        await transactionClient.busCard.findFirst({
          where: {
            id: cardId,
            passengerId: passengerProfile.id,
          },
        });

      if (!card) {
        throw new Error("CARD_NOT_FOUND");
      }

      if (card.status !== "ACTIVE") {
        throw new Error("CARD_NOT_ACTIVE");
      }

      const updatedCard =
        await transactionClient.busCard.update({
          where: {
            id: card.id,
          },

          data: {
            balance: {
              increment: input.amount,
            },
          },
        });

      const transactionReference =
        `TOPUP-${Date.now()}-${randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;

      const cardTransaction =
        await transactionClient.cardTransaction.create({
          data: {
            cardId: card.id,
            type: "TOP_UP",
            amount: input.amount,
            balanceBefore: card.balance,
            balanceAfter: updatedCard.balance,
            status: "SUCCESSFUL",
            reference: transactionReference,
            description: "Simulated mobile application top-up",
          },
        });

      return {
        card: {
          id: updatedCard.id,
          cardNumber: updatedCard.cardNumber,
          status: updatedCard.status,
          previousBalance: card.balance.toFixed(2),
          currentBalance: updatedCard.balance.toFixed(2),
        },

        transaction: {
          id: cardTransaction.id,
          type: cardTransaction.type,
          amount: cardTransaction.amount.toFixed(2),
          reference: cardTransaction.reference,
          status: cardTransaction.status,
          createdAt: cardTransaction.createdAt,
        },
      };
    },
  );

  return result;
}