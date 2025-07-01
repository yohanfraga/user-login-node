import { Request, Response, NextFunction } from 'express';

export const serverSideErrorMiddleware = ( req: Request, res: Response, next: NextFunction ) => {
  try {
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected internal server error occurred.',
    });
  }
}; 