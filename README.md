# User Login Node.js API

A robust Node.js authentication API built with Express, TypeScript, Prisma, and PostgreSQL, featuring role-based access control and comprehensive error handling.

## Features

- 🔐 **JWT Authentication** - Secure token-based authentication with automatic token management
- 🛡️ **Password Hashing** - Bcrypt password encryption with salt rounds
- ✅ **Input Validation** - Zod schema validation with detailed error messages
- 🗄️ **PostgreSQL Database** - Prisma ORM integration with migrations
- 🔒 **Protected Routes** - Role-based middleware protection
- 📝 **TypeScript** - Full type safety throughout the application
- 👥 **Role Management** - Comprehensive role-based access control system (RBAC)
- 📊 **API Documentation** - Swagger UI integration
- 🔔 **Notification System** - Global notification handling for errors and validations
- 🏗️ **Clean Architecture** - Modular structure with separation of concerns

## Quick Start

### 1. Start the Database

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The server will be available at `http://localhost:3000`
API Documentation will be available at `http://localhost:3000/api-docs`

## Role-Based Access Control (RBAC)

The API implements a comprehensive role-based access control system:

### Available Roles

- **ADMIN** - Full system access
- **USER** - Standard user access
- **VISITOR** - Limited read-only access

### Role-Protected Endpoints

#### User Management
- `GET /api/users/me` - Accessible by USER, ADMIN, VISITOR
- `GET /api/users/find_user_by_email` - Accessible by ADMIN, USER

#### Role Management
- `GET /api/roles` - Accessible by ADMIN only
- `POST /api/roles/assign` - Accessible by ADMIN only

### Error Responses for Role-Based Access

When role-based access is denied, the API returns:

```json
{
  "success": false,
  "notifications": {
    "auth": ["User does not have the required role"]
  }
}
```

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
POST /api/users/register
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

#### Get All Roles (Admin Only)
```http
GET /api/roles
Authorization: Bearer <your-jwt-token>
```

#### Assign Role to User (Admin Only)
```http
POST /api/roles/assign
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "user-id",
  "roleId": "role-id"
}
```

## Response Format

All endpoints follow a consistent response format:

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "notifications": {
    "path": "path",
    "message": "error message"
  }
}
```

### Common Response Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Valid authentication but insufficient role permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

## Project Structure

```
src/
├── config/
│   ├── environment.ts          # Environment configuration
│   └── swagger.ts             # Swagger API documentation
├── middlewares/
│   ├── authMiddleware.ts      # JWT and role-based authentication
│   ├── notificationMiddleware.ts # Global notification handling
│   └── serverSideErroMiddleware.ts # Error handling middleware
├── modules/
│   ├── auth/                  # Authentication module
│   ├── users/                 # User management module
│   └── roles/                 # Role management module
└── utils/
    ├── controller/           # Base controller
    ├── error/               # Error handling
    └── notification/        # Notification system
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained access control based on user roles
- **Password Hashing**: Bcrypt password encryption
- **Protected Routes**: Role-based middleware protection
- **Input Validation**: Zod schema validation
- **Error Handling**: Comprehensive error handling with notifications

## Default Users

The application comes with default users:
- **Admin User**:
  - Email: admin@example.com
  - Password: Admin@123
  - Role: ADMIN

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running. The documentation includes:
- All available endpoints
- Role requirements for each endpoint
- Request/response schemas
- Authentication requirements
- Example requests and responses 