import { Todo as PrismaTodo } from "@prisma/client";


export type Todo = PrismaTodo;

export interface TodoRepository {
  create(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Promise<Todo>;
  findAllByUser(userId: number): Promise<Todo[]>;
  findById(id: number, userId: number): Promise<Todo | null>;
  update(
    id: number,
    userId: number,
    data: Partial<Omit<Todo, "id" | "userId">>
  ): Promise<Todo | null>;
  delete(id: number, userId: number): Promise<boolean>;
}
