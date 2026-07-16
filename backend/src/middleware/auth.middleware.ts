import type {
  NextFunction,
  Request,
  Response,
} from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authorizationHeader = request.headers.authorization;

  if (
    !authorizationHeader ||
    !authorizationHeader.startsWith("Bearer ")
  ) {
    response.status(401).json({
      success: false,
      message: "Authentication token is required",
    });

    return;
  }

  const token = authorizationHeader
    .substring(7)
    .trim();

  if (!token) {
    response.status(401).json({
      success: false,
      message: "Authentication token is required",
    });

    return;
  }

  try {
    const payload = verifyAccessToken(token);

    if (!payload.sub || typeof payload.sub !== "string") {
      response.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });

      return;
    }

    request.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch {
    response.status(401).json({
      success: false,
      message: "Authentication token is invalid or expired",
    });
  }
}