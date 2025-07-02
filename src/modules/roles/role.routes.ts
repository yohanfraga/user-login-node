import { Router } from 'express';
import { roleController } from './role.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { Roles } from '../../utils/roles/roles';

const router = Router();

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all system roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The role ID
 *                   name:
 *                     type: string
 *                     description: The role name
 *                   description:
 *                     type: string
 *                     description: The role description
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *     description: |
 *       Requires role: ADMIN
 */
router.get('/', authMiddleware([Roles.ADMIN]), (req, res) => roleController.getAllRoles(req, res));

/**
 * @swagger
 * /roles/assign:
 *   post:
 *     summary: Assign a role to a user
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user
 *               roleId:
 *                 type: string
 *                 description: The ID of the role to assign
 *     responses:
 *       201:
 *         description: Role successfully assigned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The user ID
 *                 roleName:
 *                   type: string
 *                   description: The name of the assigned role
 *                 assignedAt:
 *                   type: string
 *                   format: date-time
 *                   description: When the role was assigned
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: User or role not found
 *     description: |
 *       Requires role: ADMIN
 */
router.post('/assign', authMiddleware([Roles.ADMIN]), (req, res) => roleController.assignRole(req, res));

export default router; 