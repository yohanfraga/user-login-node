import { Response } from 'express';
import { notificationHandler } from '../notification/notification.handler';

export class ResponseHandler {
  static success<T>(res: Response, data: T): void {
    res.status(200).json(data);
  }

  static created<T>(res: Response, data: T): void {
    res.status(201).json(data);
  }

  static error(res: Response, status: number = 400): void {
    res.status(status).json(null);
  }

  static unauthorized(res: Response): void {
    res.status(401).json(null);
  }

  static notFound(res: Response): void {
    res.status(404).json(null);
  }
} 