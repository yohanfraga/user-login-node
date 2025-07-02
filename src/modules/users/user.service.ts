import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserRequest, UserResponse } from './user.types';
import { notificationHandler } from '../../utils/notification/notification.handler';
import { createUserSchema } from './user.validate';
import { AlreadyExists, NotFoundError } from '../../utils/error/errors';
import { interpolateError } from '../../utils/error/errors.interpolation';
import { Roles } from '../../utils/roles/roles';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const registerUserPath = '/register_user';
const findUserByEmailPath = '/find_user_by_email';
const getCurrentUserPath = '/me';

export class UserService {
  async createUser(input: CreateUserRequest): Promise<UserResponse | null> {
    const { email, password, name } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      notificationHandler.addNotification(registerUserPath, interpolateError(AlreadyExists, 'User', 'email'));
      return null;
    }

    const validatedInput = createUserSchema.safeParse(input);

    if (!validatedInput.success) {
      notificationHandler.addValidationNotifications(registerUserPath, validatedInput.error.errors);
      return null;
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roles: {
          create: {
            roleId: this.visitorRoleId
          }
        }
      },
    });

    return this.mapToUserResponse(user);
  }

  async findUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      notificationHandler.addNotification(findUserByEmailPath, interpolateError(NotFoundError, 'User'));
      return null;
    }

    return this.mapToUserResponse(user);
  }

  async getCurrentUser(userId: string): Promise<UserResponse | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      notificationHandler.addNotification(getCurrentUserPath, interpolateError(NotFoundError, 'User'));
      return null;
    }

    return this.mapToUserResponse(user);
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private readonly visitorRoleId = 'clhz2fmk9000308mda2xc1p4q';
} 

export const userService = new UserService();