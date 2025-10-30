import Fastify from "fastify";
import passport from 'passport';

import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import todoRoutes from "./modules/todo/todo.routes";


export async function buildApp() {
  const app = Fastify({ logger: true });

  app.register(userRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(todoRoutes, { prefix: "/todos" });

  return app;
}
