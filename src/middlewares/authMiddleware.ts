import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/environment';
import { JwtPayload } from '../modules/auth/auth.types';
import { BaseController } from '../utils/controller/base.controller';
import { notificationHandler } from '../utils/notification/notification.handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AuthMiddleware extends BaseController {
  constructor() {
    super();
    this.handle = this.handle.bind(this);
  }

  public handle(roles: string[]): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
          notificationHandler.addNotification('auth', 'Authorization header is missing');
          return this.sendError(res, 401);
        }

        if (!authHeader.startsWith('Bearer ')) {
          notificationHandler.addNotification('auth', 'Invalid token format. Use: Bearer <token>');
          return this.sendError(res, 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
          notificationHandler.addNotification('auth', 'Token is missing');
          return this.sendError(res, 401);
        }

        try {
          const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

          if (roles.length > 0 && !decoded.roles.some((role) => roles.includes(role))) {
            notificationHandler.addNotification('auth', 'User does not have the required role');
            return this.sendError(res, 403);
          }

          (req as any).user = decoded;

          next();
        } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            notificationHandler.addNotification('auth', 'Invalid token');
            return this.sendError(res, 401);
          }
          if (error instanceof jwt.TokenExpiredError) {
            notificationHandler.addNotification('auth', 'Token has expired');
            await prisma.userToken.deleteMany({
              where: {
                token: token,
              }
            });
            return this.sendError(res, 401);
          }
          throw error;
        }
      } catch (error) {
        console.log(error);
        notificationHandler.addNotification('auth', 'Internal server error during authentication');
        return this.sendError(res, 500);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware().handle; 