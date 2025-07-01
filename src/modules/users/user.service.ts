import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserInput, PublicUser } from './user.types';
import { addNotification, addValidationNotifications } from '../../utils/notification/notification.handler';
import { createUserSchema } from './user.validate';
import { AlreadyExists, NotFoundError } from '../../utils/error/errors';
import { interpolateError } from '../../utils/error/errors.interpolation';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const registerUserPath = '/register_user';
const findUserByEmailPath = '/find_user_by_email';
const findUserByIdPath = '/find_user_by_id';

export async function createUser(input: CreateUserInput): Promise<PublicUser | null> {
  const { email, password, name } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    addNotification(registerUserPath, interpolateError(AlreadyExists, 'User', 'email'));
    return null;
  }

  const validatedInput = createUserSchema.safeParse(input);

  if (!validatedInput.success) {
    addValidationNotifications(registerUserPath, validatedInput.error.errors);
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function findUserByEmail(email: string): Promise<PublicUser | null>  {
  var user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    addNotification(findUserByEmailPath, interpolateError(NotFoundError, 'User', 'email'));
    return null;
  }

  return user;
} 

export async function findUserById(id: string): Promise<PublicUser | null>  {
  var user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    addNotification(findUserByIdPath, interpolateError(NotFoundError, 'User', 'id'));
    return null;
  }

  return user;
} 