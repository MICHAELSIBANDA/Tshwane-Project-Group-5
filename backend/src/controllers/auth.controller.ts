import type { Request, Response } from "express";
import { 
    loginSchema,
    registerPassengerSchema 
} from "../validators/auth.validator.js";
import { 
    loginUser,
    registerPassenger 
} from "../services/auth.service.js";
import { prisma } from "../config/prisma.js";


export async function registerPassengerController(
  request: Request,
  response: Response,
): Promise<void> {
  const validationResult = registerPassengerSchema.safeParse(
    request.body,
  );

  if (!validationResult.success) {
    response.status(400).json({
      success: false,
      message: "The registration information is invalid",
      errors: validationResult.error.flatten().fieldErrors,
    });

    return;
  }

  try {
    const passenger = await registerPassenger(
      validationResult.data,
    );

    response.status(201).json({
      success: true,
      message: "Passenger account created successfully",
      data: {
        passenger,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "EMAIL_ALREADY_EXISTS"
    ) {
      response.status(409).json({
        success: false,
        message: "An account with this email address already exists",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "PHONE_NUMBER_ALREADY_EXISTS"
    ) {
      response.status(409).json({
        success: false,
        message: "An account with this phone number already exists",
      });

      return;
    }

    console.error("Passenger registration error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to create the passenger account",
    });
  }
}

export async function loginController(
  request: Request,
  response: Response,
): Promise<void> {
  const validationResult = loginSchema.safeParse(request.body);

  if (!validationResult.success) {
    response.status(400).json({
      success: false,
      message: "The login information is invalid",
      errors: validationResult.error.flatten().fieldErrors,
    });

    return;
  }

  try {
    const loginResult = await loginUser(validationResult.data);

    response.status(200).json({
      success: true,
      message: "Login successful",
      data: loginResult,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_CREDENTIALS"
    ) {
      response.status(401).json({
        success: false,
        message: "Invalid email address or password",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "ACCOUNT_NOT_ACTIVE"
    ) {
      response.status(403).json({
        success: false,
        message: "This account is not active",
      });

      return;
    }

    console.error("Login error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to complete the login request",
    });
  }
}

export async function getCurrentUserController(
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
    const user = await prisma.user.findUnique({
      where: {
        id: request.auth.userId,
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
        updatedAt: true,

        passengerProfile: {
          select: {
            id: true,
          },
        },

        driverProfile: {
          select: {
            id: true,
            employeeNumber: true,
            licenceNumber: true,
          },
        },
      },
    });

    if (!user) {
      response.status(401).json({
        success: false,
        message: "The authenticated account no longer exists",
      });

      return;
    }

    if (user.status !== "ACTIVE") {
      response.status(403).json({
        success: false,
        message: "This account is not active",
      });

      return;
    }

    response.status(200).json({
      success: true,
      message: "Authenticated user retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    response.status(500).json({
      success: false,
      message: "Unable to retrieve the authenticated user",
    });
  }
}