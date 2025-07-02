import { Request, Response } from 'express';
import { authService } from './auth.service';
import { BaseController } from '../../utils/controller/base.controller';

class AuthController extends BaseController {
  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    result ? this.sendSuccess(res, result) : this.sendError(res);
  }

  async validateToken(req: Request, res: Response) {
    const { roles } = req.query;
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return this.sendError(res, 401);
    }

    const token = authHeader.split(' ')[1];
    const requiredRoles = (roles as string)?.split(',') || [];
    
    const result = await authService.validateToken(token, requiredRoles);
    
    if (!result) {
      return this.sendError(res, 401);
    }

    return this.sendSuccess(res, result);
  }
}

export const authController = new AuthController();