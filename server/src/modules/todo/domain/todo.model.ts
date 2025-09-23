import { Todo as PrismaTodo } from "@prisma/client";

export type Todo = PrismaTodo;

export interface TodoRepository {
  create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  findAllByUser(userId: string): Promise<Todo[]>;
  findById(id: string, userId: string): Promise<Todo | null>;
  update(
    id: string,
    userId: string,
    data: Partial<Omit<Todo, "id" | "userId">>
  ): Promise<Todo | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
