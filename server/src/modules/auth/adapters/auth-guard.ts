import { FastifyRequest, FastifyReply } from "fastify";
import { AuthServiceJwt } from "../application/auth-jwt.service";
import { VerifyToken } from "../application/verify-token";


const authService = new AuthServiceJwt();
const verifyToken = new VerifyToken(authService);

export async function authGuard(req: FastifyRequest, reply: FastifyReply) {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return reply.status(401).send({ error: "Missing token" });
    }

    const token = auth.replace("Bearer ", "");
    const payload = verifyToken.execute(token);

    // 👇 сохраняем payload в request, чтобы использовать в хэндлерах
    (req as any).user = payload;
  } catch (err: any) {
    return reply.status(401).send({ error: err.message });
  }
}
