import jwt from "jsonwebtoken";
import { AuthService, AuthPayload } from "../auth.types";

export class JWTService implements AuthService {
  private readonly secret: string;

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not found in .env");
    }
    this.secret = process.env.JWT_SECRET;
  }

  sign(payload: AuthPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "7d" });
  }

  verify(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.secret) as AuthPayload;
    } catch {
      return null;
    }
  }
}
