import { FastifyInstance } from "fastify";
import fastifyOauth2 from "@fastify/oauth2";
import { UserRepoPrisma } from "../user/user.repository";
import { JWTService } from "./application/jwt.service";


export default async function authRoutes(app: FastifyInstance) {
  const repo = new UserRepoPrisma();
  const jwtService = new JWTService();

  // 🔹 Регистрируем Google OAuth
  app.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: process.env.GOOGLE_CALLBACK_URL!, // 👈 обязательно!
  });

  // 🔹 Callback от Google
  app.get("/auth/google/callback", async function (req, reply) {
    const tokenResponse = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);

    // Получаем данные пользователя из Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenResponse.token.access_token}` },
    });
    const profile = await userInfoResponse.json();

    // Проверяем — есть ли пользователь
    let user = await repo.findByEmail(profile.email);
    if (!user) {
      user = await repo.create({
        name: profile.name,
        email: profile.email,
        password: "", // не нужен для OAuth
      });
    }

    // Создаём JWT
    const token = jwtService.sign({ userId: user.id, email: user.email });

    // Отправляем фронту
    return reply.send({ token });
  });
}
