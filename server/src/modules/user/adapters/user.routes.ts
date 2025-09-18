import { FastifyInstance } from "fastify";
import { UserRepoPrisma } from "./user.repository";
import { CreateUser } from "../application/create-user.service";


export default async function userRoutes(app: FastifyInstance) {
  const repo = new UserRepoPrisma();
  const createUser = new CreateUser(repo);

  app.post("/", async (req, reply) => {
    const body = req.body as { name: string; email: string; password: string };
    try {
      const user = await createUser.execute(body);
      return reply.status(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
