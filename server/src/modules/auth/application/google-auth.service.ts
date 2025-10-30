import { OAuth2Client } from "google-auth-library";
import { PrismaClient } from "@prisma/client";
import { JWTService } from "./jwt.service";


const prisma = new PrismaClient();

export class GoogleAuthService {
  private client: OAuth2Client;
  private jwt: JWTService;

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.jwt = new JWTService();
  }

  async verifyAndLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    const { email, name, picture } = payload;
    if (!email) throw new Error("Google account has no email");

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name ?? "Google User",
          email,
          password: "",
        },
      });
    }

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email, picture },
      token,
    };
  }
}
