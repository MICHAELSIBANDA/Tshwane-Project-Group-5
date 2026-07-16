import { z } from "zod";

export const linkBusCardSchema = z.object({
  cardNumber: z
    .string()
    .trim()
    .min(6, "Card number must contain at least 6 characters")
    .max(30, "Card number cannot exceed 30 characters")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "Card number may only contain letters, numbers and hyphens",
    ),
});

export const topUpCardSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, "The minimum top-up amount is R10")
    .max(5000, "The maximum top-up amount is R5 000"),
});

export type LinkBusCardInput = z.infer<
  typeof linkBusCardSchema
>;

export type TopUpCardInput = z.infer<
  typeof topUpCardSchema
>;