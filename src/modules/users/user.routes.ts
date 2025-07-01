import { Router } from 'express';
import { findUserByEmailHandler, findUserByIdHandler, registerUserHandler } from './user.controller';

const router = Router();

/**
 * @openapi
 * /api/users/register_user:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: test.user@example.com
 *               password:
 *                 type: string
 *                 default: '123456'
 *               name:
 *                 type: string
 *                 default: 'Test User'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/register_user', registerUserHandler);

router.get('/find_user_by_email/:email', findUserByEmailHandler);

router.get('/find_user_by_id/:id', findUserByIdHandler);

export default router; 