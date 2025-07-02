import { Request, Response } from 'express';
import { authService } from './auth.service';
import { BaseController } from '../../utils/controller/base.controller';

export class AuthController extends BaseController {
  async login(req: Request, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    result ? this.sendSuccess(res, result) : this.sendError(res);
  }
}

export const authController = new AuthController();