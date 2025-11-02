import { FastifyInstance } from "fastify";
import { GoogleAuthService } from "./application/google-auth.service";


export default async function authRoutes(app: FastifyInstance) {
  const googleAuthService = new GoogleAuthService();

  // 🔹 Вход через Google с фронтенда (id_token)
  // Тело запроса: { idToken: string }
  app.post("/auth/google", async (req, reply) => {
    try {
      const { idToken } = req.body as { idToken: string };
      if (!idToken) return reply.status(400).send({ error: "Missing idToken" });

      const result = await googleAuthService.loginWithIdToken(idToken);

      return reply.send(result);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message || "Unauthorized" });
    }
  });

  // 🔹 Логин через email/password (опционально)
  // Тело запроса: { email: string, password: string }
  app.post("/auth/login", async (req, reply) => {
    try {
      const { email, password } = req.body as { email: string; password: string };
      if (!email || !password) return reply.status(400).send({ error: "Missing credentials" });

      const authService = new (await import("./auth.service")).AuthService();
      const result = await authService.login(email, password);

      return reply.send(result);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message || "Unauthorized" });
    }
  });

  // 🔹 Получение данных текущего пользователя по JWT
  app.get("/auth/me", async (req, reply) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return reply.status(401).send({ error: "Missing Authorization header" });

      const token = authHeader.replace("Bearer ", "");
      const authService = new (await import("./auth.service")).AuthService();
      const payload = authService.me(token);

      return reply.send(payload);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message || "Unauthorized" });
    }
  });
}
