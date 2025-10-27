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

    async findById(id: number) {
        const user = await this.repo.findById(id);
        if (!user) throw new Error("User not found");
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.repo.findByEmail(email);
        if (!user) throw new Error("User not found");
        return user;
    }

    async findAll() {
        const users = await this.repo.findAll();
        if (!users) throw new Error("Users not found");
        return users;
    }

    async update(id: number, data: { name?: string; email?: string; password?: string }) {
        const updatedUser = await this.repo.update(id, data);
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    }

    async findByGoogleId(googleId: string) {
        // Временная реализация - нужно добавить в репозиторий
        const allUsers = await this.repo.findAll();
        return allUsers.find(user => user.googleId === googleId) || null;
    }

    async createWithGoogle(data: {
        name: string;
        email: string;
        googleId: string;
        avatar?: string;
    }){
        // Генерируем случайный пароль
        const randomPassword = await bcrypt.hash(Math.random().toString(36) + Date.now().toString(), 10);

        return this.repo.create({
            ...data,
            password: randomPassword
        });
    }
}
