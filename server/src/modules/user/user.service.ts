import { UserRepository } from "./user.model";
import bcrypt from "bcrypt";


export class UserService {
    constructor(private repo: UserRepository) { }

    async create(input: { name: string; email: string; password: string }) {
        const existing = await this.repo.findByEmail(input.email);
        if (existing) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(input.password, 10);

        return this.repo.create({
            name: input.name,
            email: input.email,
            password: hashedPassword,
        });
    }

    async byId(id: number) {
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
