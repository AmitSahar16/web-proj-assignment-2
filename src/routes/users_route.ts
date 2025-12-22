import express from 'express';
import usersController from '../controllers/users_controller';
import authMiddleware from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Users API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           description: User email
 *         password:
 *           type: string
 *           description: User password
 *       example:
 *         username: 'user1'
 *         email: 'user1@gmail.com'
 *         password: '1234567'
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get my user by the id in the token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.get('/me', authMiddleware, usersController.getUserById.bind(usersController));

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update my user by the id in the token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error
 */
router.put('/', authMiddleware, usersController.updateUserById.bind(usersController));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: get list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: list of all the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/User'
 *       500:
 *         description: Unexpected error
 */
router.get('/', usersController.get.bind(usersController));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: delete user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the id of the user to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       409:
 *         description: Error while trying to delete user
 */
router.delete('/:id', usersController.deleteById.bind(usersController));

export default router;
