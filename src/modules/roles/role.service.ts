import { PrismaClient } from '@prisma/client';
import { AssignRoleRequest, AssignRoleResponse, RoleResponse } from './role.types';
import { AlreadyExists, NotFoundError, UserAlreadyHasRoleError } from '../../utils/error/errors';
import { interpolateError } from '../../utils/error/errors.interpolation';
import { notificationHandler } from '../../utils/notification/notification.handler';

const prisma = new PrismaClient();
const assignRolePath = '/assign_role';

export class RoleService {
  async getAllRoles(): Promise<RoleResponse[]> {
    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    });

    return roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description || undefined
    }));
  }

  async assignRole(data: AssignRoleRequest): Promise<AssignRoleResponse | null> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
      include: {
        roles: true
      }
    });

    if (!user) {
      notificationHandler.addNotification(assignRolePath, interpolateError(NotFoundError, 'User'));
      return null;
    }

    if (user.roles.some(role => role.roleId === data.roleId)) {
      notificationHandler.addNotification(assignRolePath, UserAlreadyHasRoleError);
      return null;
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: data.roleId }
    });

    if (!role) {
      notificationHandler.addNotification(assignRolePath, interpolateError(NotFoundError, 'Role'));
      return null;
    }

    // Assign role to user
    const userRole = await prisma.userRole.create({
      data: {
        userId: data.userId,
        roleId: data.roleId
      },
      include: {
        role: true
      }
    });

    return {
      userId: userRole.userId,
      roleName: userRole.role.name,
      assignedAt: userRole.assignedAt
    };
  }
}   

export const roleService = new RoleService();