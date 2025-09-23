import { PrismaClient, Todo } from "@prisma/client";
import { TodoRepository } from "../domain/todo.model";


const prisma = new PrismaClient();

export class TodoRepoPrisma implements TodoRepository {
  async create(
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ): Promise<Todo> {
    return prisma.todo.create({ data: todo });
  }

  async findAllByUser(userId: string): Promise<Todo[]> {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return prisma.todo.findFirst({
      where: { id, userId },
    });
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<Todo, "id" | "userId">>
  ): Promise<Todo | null> {
    const result = await prisma.todo.updateMany({
      where: { id, userId },
      data,
    });

    if (result.count === 0) return null;

    return prisma.todo.findFirst({ where: { id, userId } });
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await prisma.todo.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }
}
