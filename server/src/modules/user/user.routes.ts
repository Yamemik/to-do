import { FastifyInstance } from "fastify";
import { UserRepoPrisma } from "./user.repository";
import { UserService } from "./user.service";


export default async function userRoutes(app: FastifyInstance) {
  const repo = new UserRepoPrisma();
  const userService = new UserService(repo);

  // all
  app.get("/", async (req, reply) => {
    try {
      const users = await userService.findAll();
      return reply.send({
        success: true,
        data: users
      });
    } catch (error: any) {
      return reply.status(404).send({
        success: false,
        error: error.message
      });
    }
  });

  app.get("/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const user = await userService.findById(Number(id));

      return reply.send({
        success: true,
        data: user
      });
    } catch (error: any) {
      return reply.status(404).send({
        success: false,
        error: error.message
      });
    }
  });
}
