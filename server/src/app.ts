import Fastify from "fastify";
import userRoutes from "./modules/user/adapters/user.routes";
import authRoutes from "./modules/auth/adapters/auth.routes";
import todoRoutes from "./modules/todo/adapters/todoRoutes";


export async function buildApp() {
  const app = Fastify({ logger: true });

  app.register(userRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(todoRoutes, { prefix: "/todos" });

  return app;
}
