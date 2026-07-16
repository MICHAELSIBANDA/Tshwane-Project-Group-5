import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import type { 
    LoginInput,
    RegisterPassengerInput 
} from "../validators/auth.validator.js";
import { createAccessToken } from "../utils/jwt.js";

export async function registerPassenger(
  input: RegisterPassengerInput,
) {
  const email = input.email.toLowerCase();

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (input.phoneNumber) {
    const existingPhoneNumber = await prisma.user.findUnique({
      where: {
        phoneNumber: input.phoneNumber,
      },
    });

    if (existingPhoneNumber) {
      throw new Error("PHONE_NUMBER_ALREADY_EXISTS");
    }
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      firstName: input.firstName,
      surname: input.surname,
      email,
      phoneNumber: input.phoneNumber,
      passwordHash,

      passengerProfile: {
        create: {},
      },
    },

    select: {
      id: true,
      firstName: true,
      surname: true,
      email: true,
      phoneNumber: true,
      role: true,
      status: true,
      createdAt: true,

      passengerProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
      firstName: true,
      surname: true,
      email: true,
      phoneNumber: true,
      passwordHash: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  // Use one general response so attackers cannot determine
  // whether a particular email address exists.
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("ACCOUNT_NOT_ACTIVE");
  }

  const accessToken = createAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",

    user: {
      id: user.id,
      firstName: user.firstName,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    },
  };
}