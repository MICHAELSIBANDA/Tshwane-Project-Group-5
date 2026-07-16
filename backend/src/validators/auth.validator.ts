import { z } from "zod";

export const registerPassengerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must contain at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  surname: z
    .string()
    .trim()
    .min(2, "Surname must contain at least 2 characters")
    .max(50, "Surname cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) => email.toLowerCase()),

  phoneNumber: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "Phone number must contain between 10 and 15 digits",
    )
    .optional(),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterPassengerInput = z.infer<
  typeof registerPassengerSchema
>;

export type LoginInput = z.infer<
    typeof loginSchema
>;