import { Request, Response } from 'express';
import { roleService } from './role.service';
import { AssignRoleRequest } from './role.types';
import { BaseController } from '../../utils/controller/base.controller';

export class RoleController extends BaseController {
  async getAllRoles(_req: Request, res: Response): Promise<void> {
    const roles = await roleService.getAllRoles();
    this.sendSuccess(res, roles);
  }

  async assignRole(req: Request, res: Response): Promise<void> {
    const data: AssignRoleRequest = req.body;
    const result = await roleService.assignRole(data);
    result ? this.sendCreated(res, result) : this.sendError(res);
  }
} 

export const roleController = new RoleController();