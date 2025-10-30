import { TodoRepository } from "../todo.model";


export class DeleteTodo {
  constructor(private repo: TodoRepository) {}

  async execute(userId: string, id: string) {
    const ok = await this.repo.delete(id, userId);
    if (!ok) throw new Error("Todo not found or not yours");
    return true;
  }
}
