import { PrismaClient } from "@prisma/client";
import { User, UserRepository } from "./user.model";


const prisma = new PrismaClient();

export class UserRepoPrisma implements UserRepository {
  async create(user: Omit<User, "id">): Promise<User> {
    return prisma.user.create({ data: user });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[] | null> {
    return prisma.user.findMany();
  }

 async update(id: number, data: Partial<User>): Promise<User | null> {
      return await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }
}
