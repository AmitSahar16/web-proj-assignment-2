import express from 'express';
import commentsController from '../controllers/comments_controller';
import authMiddleware from '../middleware/auth';
import { checkCommentOwnership } from '../middleware/ownership';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *         - postId
 *       properties:
 *         text:
 *           type: string
 *           description: The comment text
 *         post:
 *           type: string
 *           description: The ID of the post this comment belongs to
 *         user:
 *           type: string
 *           description: The ID of the user who created the comment
 *       example:
 *         text: Great post!
 *         post: 507f1f77bcf86cd799439011
 */

// Get all comments
/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/', commentsController.get.bind(commentsController));

// Get comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Get comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.get('/:id', commentsController.getById.bind(commentsController));

// Create a new comment
/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - post
 *             properties:
 *               text:
 *                 type: string
 *               post:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.post('/', authMiddleware, commentsController.create.bind(commentsController));

// Update comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 */
router.put('/:id', authMiddleware, checkCommentOwnership, commentsController.updateCommentById.bind(commentsController));

// Delete comment by ID
/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment by ID
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/:id', authMiddleware, checkCommentOwnership, commentsController.deleteById.bind(commentsController));

export default router;