import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { JWTService } from "./application/jwt.service";


const prisma = new PrismaClient();

export class AuthService {
  private jwt: JWTService;

  constructor() {
    this.jwt = new JWTService();
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  me(token: string) {
    const payload = this.jwt.verify(token);
    if (!payload) throw new Error("Invalid token");
    return payload;
  }
}
