import { FastifyInstance } from "fastify";
import { UserRepoPrisma } from "./user.repository";
import { UserService } from "./user.service";
import { authGuard } from "../auth/adapters/auth-guard";


export default async function userRoutes(app: FastifyInstance) {
  const repo = new UserRepoPrisma();
  const createUser = new UserService(repo);

  // 🚀 Регистрация нового пользователя (доступно всем)
  app.post("/", async (req, reply) => {
    const body = req.body as { name: string; email: string; password: string };
    try {
      const user = await createUser.create(body);
      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  // 🔒 Получение текущего юзера (только с JWT)
  app.get("/me", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user; // 👈 authGuard кладёт сюда payload
    return reply.send({ user });
  });

  // all
  app.get("/all", async (req,reply)=>{
    return  
  });
}
