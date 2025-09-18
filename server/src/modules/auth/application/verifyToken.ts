import { AuthService, AuthPayload } from "../domain/auth.model";

export class VerifyToken {
  constructor(private authService: AuthService) {}

  execute(token: string): AuthPayload {
    const payload = this.authService.verify(token);
    if (!payload) throw new Error("Invalid token");
    return payload;
  }
}
