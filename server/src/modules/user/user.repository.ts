import { PrismaClient } from "@prisma/client";
import { User, UserUpdate, UserPublic, UserRepository } from "./user.model";


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

  async findAll(): Promise<UserPublic[]> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async update(id: number, data: Partial<UserUpdate>): Promise<UserPublic | null> {
    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        googleId: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updated;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { googleId } });
  }
}
