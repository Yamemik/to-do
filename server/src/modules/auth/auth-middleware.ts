import { FastifyReply, FastifyRequest } from "fastify";
import { JWTService } from "./application/jwt.service";

const jwtService = new JWTService();

/**
 * Middleware для защиты приватных роутов.
 * Проверяет Authorization: Bearer <token> и декодирует payload.
 */
export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.status(401).send({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = jwtService.verify(token);

    if (!payload) {
      return reply.status(401).send({ error: "Invalid token" });
    }

    // ✅ Добавляем пользователя в запрос
    (request as any).user = payload;
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
