export interface AuthPayload {
  userId: number;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

export interface AuthService {
  sign(payload: AuthPayload): string;
  verify(token: string): AuthPayload | null;
}
