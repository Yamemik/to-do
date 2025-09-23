import jwt from "jsonwebtoken";
import { AuthService, AuthPayload } from "../domain/auth.model";


const SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthServiceJwt implements AuthService {
  sign(payload: AuthPayload): string {
    return jwt.sign(payload, SECRET, { expiresIn: "1h" });
  }

  verify(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, SECRET) as AuthPayload;
    } catch {
      return null;
    }
  }
}
