import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { GoogleAuthService } from "./application/google-auth.service";
import { UserRepoPrisma } from "../user/user.repository";


export default async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService();
  const googleAuth = new GoogleAuthService(new UserRepoPrisma());

  /**
   * 📌 Регистрация по email
   * POST /auth/register
   * body: { name, email, password }
   */
  app.post("/auth/register", async (req, reply) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!email || !password || !name) {
      return reply.status(400).send({ error: "Missing fields" });
    }

    try {
      const repo = new UserRepoPrisma();
      const existing = await repo.findByEmail(email);
      if (existing) {
        return reply.status(409).send({ error: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await repo.create({
        name,
        email,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const token = authService["jwt"].sign({ userId: user.id, email: user.email });

      return reply.status(201).send({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (err: any) {
      return reply.status(500).send({ error: err.message });
    }
  });

  /**
   * 📌 Логин по email
   * POST /auth/login
   * body: { email, password }
   */
  app.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return reply.status(400).send({ error: "Missing email or password" });
    }

    try {
      const result = await authService.login(email, password);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });

  /**
   * 📌 Логин через Google (через id_token)
   * POST /auth/google
   * body: { id_token }
   */
  app.post("/auth/google", async (req, reply) => {
    const { id_token } = req.body as { id_token: string };
    if (!id_token) {
      return reply.status(400).send({ error: "Missing id_token" });
    }

    try {
      const result = await googleAuth.verifyAndLogin(id_token);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });

  /**
   * 📌 Проверка текущего пользователя (по JWT)
   * GET /auth/me
   * headers: { Authorization: Bearer <token> }
   */
  app.get("/auth/me", async (req, reply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    try {
      const payload = authService.me(token);
      return reply.send(payload);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });
}
