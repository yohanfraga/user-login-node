import { Response } from 'express';

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T): void {
    res.status(200).json(data);
  }

  protected sendCreated<T>(res: Response, data: T): void {
    res.status(201).json(data);
  }

  protected sendError(res: Response, status: number = 400): void {
    res.status(status).json(null);
  }

  protected sendNotFound(res: Response): void {
    res.status(404).json(null);
  }
} 