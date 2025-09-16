import { UserRepository } from "../domain/user.model";


export class GetUser {
  constructor(private repo: UserRepository) {}

  async byId(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    return user;
  }

  async byEmail(email: string) {
    const user = await this.repo.findByEmail(email);
    if (!user) throw new Error("User not found");
    return user;
  }
}
