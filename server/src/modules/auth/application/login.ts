import { UserRepository } from "../../user/domain/user.model";
import { signToken } from "../adapters/jwt";
import bcrypt from "bcrypt";


export class Login {
  constructor(private repo: UserRepository) {}

  async execute(input: { email: string; password: string }) {
    const user = await this.repo.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    return { token: signToken({ userId: user.id, email: user.email }) };
  }
}
