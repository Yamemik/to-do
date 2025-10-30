import { FastifyReply, FastifyRequest } from "fastify";
import { JWTService } from "./application/jwt.service";


const jwtService = new JWTService();

export async function authGuard(
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

    // Добавляем данные пользователя в запрос (для доступа в хендлерах)
    (request as any).user = payload;
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}
