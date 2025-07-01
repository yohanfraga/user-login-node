import { User } from '@prisma/client';

/**
 * Represents the user object that is safe to be sent to clients.
 * It omits the 'password' field from the original User model.
 */
export type PublicUser = Omit<User, 'password'>;

/**
 * Represents the data required to create a new user.
 * It picks only the 'email', 'password', and 'name' fields from the User model.
 */
export type CreateUserInput = Pick<User, 'email' | 'password' | 'name'>; 