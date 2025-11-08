import Fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { logger } from "./shared/logger";

import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import todoRoutes from "./modules/todo/todo.routes";

export async function buildApp(opts?: FastifyServerOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
        },
      },
    },
    ...opts,
  });

  app.register(userRoutes, { prefix: "/users" });
  app.register(authRoutes, { prefix: "/auth" });
  app.register(todoRoutes, { prefix: "/todos" });

  return app;
}
