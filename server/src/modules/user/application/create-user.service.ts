import { UserRepository } from "../domain/user.model";
import bcrypt from "bcrypt";


export class CreateUser {
  constructor(private repo: UserRepository) {}

  async execute(input: { name: string; email: string; password: string }) {
    const existing = await this.repo.findByEmail(input.email);
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.repo.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });
  }
}
