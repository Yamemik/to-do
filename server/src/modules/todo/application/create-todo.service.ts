import { TodoRepository } from "../todo.model";


export class CreateTodo {
  constructor(private repo: TodoRepository) {}

  async execute(userId: string, input: { title: string }) {
    return this.repo.create({
      userId,
      title: input.title,
      completed: false,
    });
  }
}
