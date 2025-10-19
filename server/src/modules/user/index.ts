// index.ts
export { User } from './user.model';
export { UserRepoPrisma } from './user.repository';
export { UserService } from './user.service';
export { default as userRoutes } from './user.routes';

// Фабрика для создания экземпляров
export function createUserModule(userRepo: UserRepository) {
  const userService = new UserService(userRepo);
  return { userService };
}