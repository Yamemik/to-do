import { FastifyInstance } from "fastify";
import { UserRepoPrisma } from "../../user/user.repository";
import { AuthServiceJwt } from "../application/auth-jwt.service";
import { Login } from "../application/login.service";
import { VerifyToken } from "../application/verify-token";


export default async function authRoutes(app: FastifyInstance) {
  const repo = new UserRepoPrisma();
  const authService = new AuthServiceJwt();
  const login = new Login(repo, authService);
  const verifyToken = new VerifyToken(authService);

  app.post("/login", async (req, reply) => {
    const body = req.body as { email: string; password: string };
    try {
      const result = await login.execute(body);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });

  app.get("/me", async (req, reply) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) throw new Error("Missing token");

      const token = auth.replace("Bearer ", "");
      const payload = verifyToken.execute(token);

      return reply.send(payload);
    } catch (err: any) {
      return reply.status(401).send({ error: err.message });
    }
  });
}
