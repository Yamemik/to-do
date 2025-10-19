# Fastify Template 🚀

Современный, масштабируемый шаблон для быстрого старта Backend-приложений на [Fastify](https://fastify.io/) с полным набором инструментов для разработки.

## ✨ Особенности

- **🦋 Fastify** - Высокопроизводительный веб-фреймворк
- **🔷 TypeScript** - Полная типобезопасность
- **🗃️ Prisma** - Modern ORM для PostgreSQL
- **🧪 Jest** - Тестирование с покрытием кода
- **🐳 Docker** - Контейнеризация приложения
- **📦 pnpm** - Быстрый менеджер пакетов
- **🔐 JWT Authentication** - Готовая система аутентификации
- **📊 Swagger/OpenAPI** - Автогенерация документации
- **🧹 ESLint + Prettier** - Линтинг и форматирование
- **📝 Логирование** - Структурированные логи с Pino

## 🚀 Быстрый старт

### Предварительные требования

- Node.js 18+ 
- PostgreSQL 12+
- pnpm 8+

### Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/Yamemik/fastify-template.git
cd fastify-template
```
2. **Установите зависимости**
```bash
pnpm i
```
3. **Генерация Prisma Client**
```bash
npx prisma generate
pnpm prisma migrate dev --name change-id-to-int
```


### **env**
```m
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todoapp?schema=public"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development
```