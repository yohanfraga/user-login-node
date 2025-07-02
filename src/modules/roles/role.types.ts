export type RoleResponse = {
  id: string;
  name: string;
  description?: string;
};

export type AssignRoleRequest = {
  userId: string;
  roleId: string;
};

export type AssignRoleResponse = {
  userId: string;
  roleName: string;
  assignedAt: Date;
}; 