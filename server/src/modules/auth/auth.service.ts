import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { JWTService } from "./application/jwt.service";


const prisma = new PrismaClient();

export class AuthService {
  private jwt: JWTService;

  constructor() {
    this.jwt = new JWTService();
  }

  // 🔹 Регистрация
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User with this email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email },
      token,
    };
  }
    
  /**
   * Авторизация по email + password
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = await this.jwt.sign({ userId: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  /**
   * Получение текущего пользователя по токену
   */
  async me(authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = await this.jwt.verify(token);

    if (!payload) throw new Error("Invalid token");

    // Находим пользователя по ID
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new Error("User not found");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
