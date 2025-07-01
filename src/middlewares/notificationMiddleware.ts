import { Request, Response, NextFunction } from 'express';
import { getNotifications, hasNotifications } from '../utils/notification/notification.handler';

export const notificationMiddleware = ( req: Request, res: Response, next: NextFunction ) => {
  // If a response has already been sent, do nothing.
  if (res.headersSent) {
    return next();
  }

  if (hasNotifications()) {
    return res.status(400).json(getNotifications())
  }

  next();
}; 