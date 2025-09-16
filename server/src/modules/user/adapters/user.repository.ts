import { PrismaClient } from "@prisma/client";
import { User, UserRepository } from "../domain/user.model";


const prisma = new PrismaClient();

export class UserRepoPrisma implements UserRepository {
  async create(user: Omit<User, "id">): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
}
