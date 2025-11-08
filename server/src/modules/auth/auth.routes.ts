import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { GoogleAuthService } from "./application/google-auth.service";
import { UserRepoPrisma } from "../user/user.repository";
import { MailService } from "../../shared/mail.service";
import { JWTService } from "./application/jwt.service";
import { logger } from "../../shared/logger";
import { NotFoundError, UnauthorizedError } from "../../shared/errors";
import { UserPublic } from "../user/user.model";


export default async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService();
  const googleAuth = new GoogleAuthService(new UserRepoPrisma());
  const mailService = new MailService();
  const jwt = new JWTService();
  const userRepo = new UserRepoPrisma();

  // -----------------------------
  // Регистрация с подтверждением email
  // -----------------------------
  app.post("/register", async (req: FastifyRequest, reply: FastifyReply) => {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      logger.warn({ name, email }, "Registration attempt with missing fields");
      return reply.status(400).send({ error: "Missing fields" });
    }

    try {
      const existing = await userRepo.findByEmail(email);
      if (existing) {
        logger.warn({ email }, "Registration attempt for existing email");
        return reply.status(409).send({ error: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 10);
      const user = await userRepo.create({
        name,
        email,
        password: hashed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // JWT для подтверждения email (1 день)
      const verifyToken = jwt.sign({ userId: user.id, email: user.email });

      await mailService.sendVerificationEmail(user.email, verifyToken);

      logger.info({ email }, "User registered and verification email sent");

      return reply.status(201).send({
        message: "Registration successful. Check your email for verification link.",
      });
    } catch (err: any) {
      logger.error({ err }, "Error during registration");
      return reply.status(500).send({ error: err.message });
    }
  });

  // -----------------------------
  // Подтверждение email
  // -----------------------------
  app.get("/verify", async (req: FastifyRequest, reply: FastifyReply) => {
    const { token } = req.query as { token?: string };
    if (!token) return reply.status(400).send({ error: "Missing token" });

    try {
      const payload = jwt.verify(token);
      if (!payload) return reply.status(400).send({ error: "Invalid token" });

      const user = await userRepo.findById(payload.userId);
      if (!user) throw new NotFoundError("User not found");
      if (user.isVerified)
        return reply.status(200).send({ message: "Email already verified" });

      await userRepo.update(user.id, { isVerified: true });

      logger.info({ email: user.email }, "Email verified successfully");

      return reply.status(200).send({ message: "Email verified successfully" });
    } catch (err: any) {
      logger.error({ err }, "Email verification failed");
      return reply.status(400).send({ error: err.message });
    }
  });

  // -----------------------------
  // Логин по email
  // -----------------------------
  app.post("/login", async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return reply.status(400).send({ error: "Missing email or password" });

    try {
      const user = await userRepo.findByEmail(email);
      if (!user) throw new UnauthorizedError("Invalid credentials");
      if (!user.isVerified) throw new UnauthorizedError("Email not verified");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new UnauthorizedError("Invalid credentials");

      const token = jwt.sign({ userId: user.id, email: user.email });

      const userPublic: UserPublic = {
        id: user.id,
        name: user.name,
        email: user.email,
        googleId: user.googleId,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      logger.info({ email }, "User logged in successfully");

      return reply.send({ token, user: userPublic });
    } catch (err: any) {
      logger.error({ err, email }, "Login failed");
      return reply.status(err.statusCode || 401).send({ error: err.message });
    }
  });

  // 📌 Повторная отправка письма подтверждения
  app.post("/resend-verification", async (req: FastifyRequest, reply: FastifyReply) => {
    const { email } = req.body as { email?: string };
    if (!email) return reply.status(400).send({ error: "Missing email" });

    try {
      const user = await userRepo.findByEmail(email);
      if (!user) return reply.status(404).send({ error: "User not found" });
      if (user.isVerified) return reply.status(200).send({ message: "Email already verified" });

      // Генерируем новый verifyToken (например, 1 день)
      const verifyToken = jwt.sign({ userId: user.id, email: user.email });

      await mailService.sendVerificationEmail(user.email, verifyToken);

      logger.info({ email }, "Resent verification email");
      return reply.status(200).send({
        message: "Verification email sent. Please check your inbox.",
      });
    } catch (err: any) {
      logger.error({ err }, "Error resending verification email");
      return reply.status(500).send({ error: err.message });
    }
  });

  // -----------------------------
  // Google login через id_token
  // -----------------------------
  app.post("/google", async (req: FastifyRequest, reply: FastifyReply) => {
    const { id_token } = req.body as { id_token?: string };
    if (!id_token) return reply.status(400).send({ error: "Missing id_token" });

    try {
      const result = await googleAuth.verifyAndLogin(id_token);
      logger.info({ email: result.user.email }, "Google login successful");
      return reply.send(result);
    } catch (err: any) {
      logger.error({ err }, "Google login failed");
      return reply.status(401).send({ error: err.message });
    }
  });

  // -----------------------------
  // Проверка текущего пользователя
  // -----------------------------
  app.get("/me", async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return reply.status(401).send({ error: "Missing Authorization header" });
    
    try {
      const payload = authService.me(authHeader);
      return reply.send(payload);
    } catch (err: any) {
      logger.error({ err }, "Failed to get current user");
      return reply.status(401).send({ error: err.message });
    }
  });
}
