import { UserRepository } from "../../user/domain/user.model";
import { AuthService } from "../domain/auth.model";
import bcrypt from "bcrypt";


export class Login {
  constructor(
    private repo: UserRepository,
    private authService: AuthService
  ) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.repo.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = this.authService.sign({
      userId: user.id,
      email: user.email,
    });

    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }
}
