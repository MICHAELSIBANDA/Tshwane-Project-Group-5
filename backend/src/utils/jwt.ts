import jwt, {
  type JwtPayload,
  type SignOptions,
} from "jsonwebtoken";

export interface AccessTokenPayload extends JwtPayload {
  email: string;
  role: string;
}

function getAccessSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not defined");
  }

  return secret;
}

export function createAccessToken(user: {
  id: string;
  email: string;
  role: string;
}): string {
  const expiresIn = (
    process.env.JWT_ACCESS_EXPIRES_IN ?? "15m"
  ) as SignOptions["expiresIn"];

  return jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    getAccessSecret(),
    {
      subject: user.id,
      expiresIn,
      algorithm: "HS256",
    },
  );
}

export function verifyAccessToken(
  token: string,
): AccessTokenPayload {
  const decoded = jwt.verify(token, getAccessSecret(), {
    algorithms: ["HS256"],
  });

  if (typeof decoded === "string") {
    throw new Error("INVALID_ACCESS_TOKEN");
  }

  return decoded as AccessTokenPayload;
}