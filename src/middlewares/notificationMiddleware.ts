import { Request, Response, NextFunction } from 'express';
import { notificationHandler } from '../utils/notification/notification.handler';

export const notificationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;

  res.json = function(data: any) {
    const notifications = notificationHandler.getNotifications();

    if (notifications.length === 0) {
      return originalJson.call(res, data);
    }

    return originalJson.call(res, notifications);
  };

  notificationHandler.clearNotifications();

  next();
}; 