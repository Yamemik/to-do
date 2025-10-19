export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface UserRepository {
  create(user: Omit<User, "id">): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}
