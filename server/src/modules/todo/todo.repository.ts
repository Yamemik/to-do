import { PrismaClient, Todo } from "@prisma/client";
import { TodoRepository } from "./todo.model";


const prisma = new PrismaClient();

export class TodoRepoPrisma implements TodoRepository {
  async create(
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ): Promise<Todo> {
    return prisma.todo.create({ data: todo });
  }

  async findAllByUser(userId: number): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: number, userId: number): Promise<Todo | null> {
    return prisma.todo.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: number,
    userId: number,
    data: Partial<Omit<Todo, "id" | "userId">>
  ): Promise<Todo | null> {
    const result = await prisma.todo.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) return null;

    return prisma.todo.findFirst({ where: { id, userId } });
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const result = await prisma.todo.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}
