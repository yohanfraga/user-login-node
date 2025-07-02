import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { LoginRequest, AuthResponse, JwtPayload } from './auth.types';
import { ENV } from '../../config/environment';
import { InvalidCredentialsError, NotFoundError } from '../../utils/error/errors';
import { interpolateError } from '../../utils/error/errors.interpolation';
import { notificationHandler } from '../../utils/notification/notification.handler';

const prisma = new PrismaClient();
const loginPath = '/login';

export class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse | null> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      notificationHandler.addNotification(loginPath, interpolateError(NotFoundError, 'User'));
      return null;
    }

    const isPasswordValid = await this.comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      notificationHandler.addNotification(loginPath, InvalidCredentialsError);
      return null;
    }

    await prisma.userToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const token = this.generateToken({
      userId: user.id,
      name: user.name,
      email: user.email,
    });

    const expiresInMinutes = ENV.JWT_EXPIRES_IN;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    await prisma.userToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
  }
  
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: `${ENV.JWT_EXPIRES_IN}m`,
    });
  }

  private async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 

export const authService = new AuthService();