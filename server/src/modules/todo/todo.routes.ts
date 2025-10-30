import { FastifyInstance } from "fastify";
import { authGuard } from "../auth/auth-guard";
import { TodoRepoPrisma } from "./todo.repository";
import { CreateTodo } from "./application/create-todo.service";
import { GetTodos } from "./application/get-todo.service";
import { UpdateTodo } from "./application/update-todo.service";
import { DeleteTodo } from "./application/delete-todo.service";


export default async function todoRoutes(app: FastifyInstance) {
  const repo = new TodoRepoPrisma();
  const createTodo = new CreateTodo(repo);
  const getTodos = new GetTodos(repo);
  const updateTodo = new UpdateTodo(repo);
  const deleteTodo = new DeleteTodo(repo);

  // ✅ Создание задачи
  app.post("/", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user;
    const body = req.body as { title: string };
    const todo = await createTodo.execute(user.userId, body);
    return reply.status(201).send(todo);
  });

  // ✅ Получение всех задач юзера
  app.get("/", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user;
    const todos = await getTodos.all(user.userId);
    return reply.send(todos);
  });

  // ✅ Получение одной задачи
  app.get("/:id", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };
    try {
      const todo = await getTodos.byId(user.userId, id);
      return reply.send(todo);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  // ✅ Обновление задачи
  app.put("/:id", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };
    const body = req.body as { title?: string; completed?: boolean };
    try {
      const todo = await updateTodo.execute(user.userId, id, body);
      return reply.send(todo);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  // ✅ Удаление задачи
  app.delete("/:id", { preHandler: authGuard }, async (req, reply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };
    try {
      await deleteTodo.execute(user.userId, id);
      return reply.status(204).send();
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
