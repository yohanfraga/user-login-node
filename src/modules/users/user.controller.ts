import { Request, Response } from 'express';
import { userService } from './user.service';
import { BaseController } from '../../utils/controller/base.controller';

export class UserController extends BaseController {
  async registerUser(req: Request, res: Response): Promise<void> {
    const user = await userService.createUser(req.body);
    user ? this.sendCreated(res, user) : this.sendError(res);
  }

  async findUserByEmail(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;
    const user = await userService.findUserByEmail(email);
    user ? this.sendSuccess(res, user) : this.sendNotFound(res);
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const user = await userService.getCurrentUser(userId);
    user ? this.sendSuccess(res, user) : this.sendNotFound(res);
  }
}

export const userController = new UserController();