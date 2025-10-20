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

    async getById(id: number) {
        const user = await this.repo.findById(id);
        if (!user) throw new Error("User not found");
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.repo.findByEmail(email);
        if (!user) throw new Error("User not found");
        return user;
    }

    async getAll() {
        const users = await this.repo.findAll();
        if (!users) throw new Error("Users not found");
        return users;
    }

    async updateById(id: number, data: { name?: string; email?: string; password?: string }) {
        const updatedUser = await this.repo.update(id, data);
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    }
}
