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
      include: {
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
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
      roles: user.roles.map((userRole) => userRole.role.name),
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

  async validateToken(token: string, requiredRoles: string[] = []): Promise<{ valid: boolean; user?: any }> {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      
      if (decoded.roles.length === 0) {
        notificationHandler.addNotification('auth', 'User does not have any roles');
        return { valid: false };
      }

      if (requiredRoles.length > 0 && !decoded.roles.some(role => requiredRoles.includes(role))) {
        notificationHandler.addNotification('auth', 'User does not have the required role');
        return { valid: false };
      }
      
      return {
        valid: true,
        user: {
          id: decoded.userId,
          name: decoded.name,
          email: decoded.email,
          roles: decoded.roles
        }
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        notificationHandler.addNotification('auth', 'Invalid token');
      } else if (error instanceof jwt.TokenExpiredError) {
        notificationHandler.addNotification('auth', 'Token has expired');
      } else {
        notificationHandler.addNotification('auth', 'Error validating token');
      }
      return { valid: false };
    }
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