import { TodoRepository } from "../todo.model";


export class GetTodos {
  constructor(private repo: TodoRepository) {}

  async all(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async byId(userId: string, id: string) {
    const todo = await this.repo.findById(id, userId);
    if (!todo) throw new Error("Todo not found");
    return todo;
  }
}
