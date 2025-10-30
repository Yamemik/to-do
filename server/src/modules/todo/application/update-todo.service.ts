import { TodoRepository } from "../todo.model";


export class UpdateTodo {
  constructor(private repo: TodoRepository) {}

  async execute(userId: string, id: string, data: { title?: string; completed?: boolean }) {
    const todo = await this.repo.update(id, userId, data);
    if (!todo) throw new Error("Todo not found or not yours");
    return todo;
  }
}
