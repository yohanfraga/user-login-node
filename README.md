# User Login Node.js API

A robust Node.js authentication API built with Express, TypeScript, Prisma, and PostgreSQL, featuring role-based access control and comprehensive error handling.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication with automatic token management
- 🛡️ **Password Hashing** - Bcrypt password encryption with salt rounds
- ✅ **Input Validation** - Zod schema validation with detailed error messages
- 🗄️ **PostgreSQL Database** - Prisma ORM integration with migrations
- 🔒 **Protected Routes** - Middleware-based route protection
- 📝 **TypeScript** - Full type safety throughout the application
- 👥 **Role Management** - Role-based access control system
- 📊 **API Documentation** - Swagger UI integration
- 🔔 **Notification System** - Global notification handling for errors and validations
- 🏗️ **Clean Architecture** - Modular structure with separation of concerns

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://admin:root@localhost:5433/user_login_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN=50

# Server
PORT=3000
NODE_ENV=development
```

### 2. Database Setup

Start the PostgreSQL database:

```bash
docker-compose up -d
```

Run database migrations and seed:

```bash
npm run db:deploy
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:3000`
API Documentation will be available at `http://localhost:3000/api-docs`

## API Endpoints

### Authentication

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### Users

#### Register User
```http
POST /api/users/register_user
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123"
}
```

#### Get Current User (Protected)
```http
GET /api/users/me
Authorization: Bearer <your-jwt-token>
```

#### Find User by Email (Protected)
```http
GET /api/users/find_user_by_email?email=user@example.com
Authorization: Bearer <your-jwt-token>
```

### Roles

#### Get All Roles (Protected)
```http
GET /api/roles
Authorization: Bearer <your-jwt-token>
```

#### Assign Role to User (Protected)
```http
POST /api/roles/assign_role
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "user-id",
  "roleId": "role-id"
}
```

## Response Format

All endpoints return a consistent response format:

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token-here"
  }
}
```

### Error Response with Notifications
```json
{
  "success": false,
  "notifications": [
    {
      "path": "/login",
      "message": "Invalid credentials"
    }
  ]
}
```

## Project Structure

```
src/
├── config/
│   ├── environment.ts          # Environment configuration
│   └── swagger.ts              # Swagger API documentation
├── middlewares/
│   ├── authMiddleware.ts       # JWT authentication middleware
│   ├── notificationMiddleware.ts # Global notification handling
│   └── serverSideErroMiddleware.ts # Error handling middleware
├── modules/
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts  # Request handlers
│   │   ├── auth.routes.ts      # Route definitions
│   │   ├── auth.service.ts     # Business logic
│   │   └── auth.types.ts       # TypeScript interfaces
│   ├── users/                  # User management module
│   │   ├── user.controller.ts
│   │   ├── user.routes.ts
│   │   ├── user.service.ts
│   │   ├── user.types.ts
│   │   └── user.validate.ts
│   └── roles/                  # Role management module
│       ├── role.controller.ts
│       ├── role.routes.ts
│       ├── role.service.ts
│       └── role.types.ts
├── utils/
│   ├── controller/
│   │   └── base.controller.ts  # Base controller with response methods
│   ├── error/
│   │   ├── errors.ts           # Error definitions
│   │   └── errors.interpolation.ts # Error message interpolation
│   └── notification/
│       ├── notification.handler.ts # Notification management
│       └── notification.types.ts   # Notification types
└── index.ts                    # Application entry point
```

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
- **JWT Tokens**: Secure token-based authentication with configurable expiration
- **Input Validation**: All inputs are validated using Zod schemas
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Protected Routes**: Middleware-based route protection
- **Role-Based Access**: Role management system for fine-grained permissions
- **Token Management**: Automatic cleanup of old tokens on login

## Database Schema

The application includes:
- **Users**: User accounts with email, name, and hashed passwords
- **Roles**: Role definitions (Admin, User, Visitor)
- **UserTokens**: JWT token storage with expiration tracking
- **UserRoles**: Many-to-many relationship between users and roles

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:deploy` - Deploy database schema and seed data
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

### Database Commands

- `npx prisma db push` - Push schema changes to database
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma generate` - Generate Prisma Client

## Default Admin User

The application comes with a default admin user:
- **Email**: admin@example.com
- **Password**: Admin@123
- **Role**: Admin

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

## Error Handling

The application uses a global notification system that:
- Captures validation errors from Zod schemas
- Provides consistent error responses
- Supports multiple notification types (error, warning, info, success)
- Automatically formats error messages for client consumption 