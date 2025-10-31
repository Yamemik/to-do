export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  googleId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserUpdate {
  id: number;
  name: string;
  email: string;
  updatedAt?: Date;
}

export interface UserRepository {
  create(user: Omit<User, "id">): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  update(id: number, data: Partial<UserUpdate>): Promise<UserUpdate | null>;
  findAll(): Promise<User[]>;
}
