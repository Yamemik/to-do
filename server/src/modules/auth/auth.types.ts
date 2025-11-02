export interface AuthPayload {
  userId: number;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Контракт для JWT сервисов (подпись и проверка токена)
 */
export interface IAuthTokenService {
  sign(payload: AuthPayload): string | Promise<string>;
  verify(token: string): AuthPayload | null | Promise<AuthPayload | null>;
}
