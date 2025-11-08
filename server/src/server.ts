import Fastify from "fastify";
import dotenv from "dotenv";
import { buildApp } from "./app";
import { logger } from "./shared/logger";


dotenv.config();

async function start() {
  const app = await buildApp();

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  try {
    await app.listen({ port, host: "0.0.0.0" });
    logger.info(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
