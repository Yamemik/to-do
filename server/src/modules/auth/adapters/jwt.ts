import jwt from "jsonwebtoken";
import { AuthPayload } from "../domain/auth.model";


const SECRET = process.env.JWT_SECRET || "supersecret";

export function signToken(payload: AuthPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, SECRET) as AuthPayload;
}
