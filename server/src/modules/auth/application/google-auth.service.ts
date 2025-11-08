import { OAuth2Client } from "google-auth-library";
import { JWTService } from "./jwt.service";
import { UserRepoPrisma } from "../../user/user.repository";
import { UserRepository } from "../../user/user.model";


export class GoogleAuthService {
  private client: OAuth2Client;
  private jwt: JWTService;
  private users: UserRepository;

  constructor(repo?: UserRepository) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.jwt = new JWTService();
    this.users = repo ?? new UserRepoPrisma();
  }

  async verifyAndLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    const { email, name, sub: googleId, picture } = payload;
    if (!email) throw new Error("Google account has no email");

    let user = await this.users.findByGoogleId(googleId!);
    if (!user) {
      user = await this.users.findByEmail(email);
    }

    if (!user) {
      user = await this.users.create({
        name: name ?? "Google User",
        email,
        password: "",
        googleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else if (!user.googleId) {
      await this.users.update(user.id, { googleId });
    }

    const token = this.jwt.sign({ userId: user.id, email: user.email });

    return {
      user: { id: user.id, name: user.name, email: user.email, picture },
      token,
    };
  }
}
