import express from 'express';
import postsController from '../controllers/posts_controller';
import commentsController from '../controllers/comments_controller';
import authMiddleware from '../middleware/auth';
import { checkPostOwnership } from '../middleware/ownership';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - user
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: The post description        
 *         user:
 *           type: string
 *           description: The user that created the post
 *       example:
 *         user: 'userid12345'
 *         message: 'Nice post!'
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: get list of posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: list of all the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get('/', postsController.get.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: get post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the id of the post to get
 *     responses:
 *       200:
 *         description: the post with the id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get('/:id', postsController.getPostById.bind(postsController));

/**
 * @swagger
 * /posts/user/me:
 *   get:
 *     summary: get all my posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: list of posts with the user id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Post'
 *       500:
 *         description: Unexpected error
 */
router.get(
  '/user/me',
  authMiddleware,
  postsController.getPostsByMe.bind(postsController)
);

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: create new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *        200:
 *          description: the new post
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        409:
 *          description: Error while trying to create new post
 */
router.post('/', authMiddleware, postsController.create.bind(postsController));

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: update post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Numeric ID of the post to update
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Error while trying to update post
 */
router.put(
  '/:id',
  authMiddleware,
  checkPostOwnership,
  postsController.updatePostById.bind(postsController)
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: delete post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the id of the post to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: the deleted post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       409:
 *         description: Error while trying to delete post
 */
router.delete(
  '/:id',
  authMiddleware,
  checkPostOwnership,
  postsController.deleteById.bind(postsController)
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get all comments for a specific post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comments for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Error retrieving comments
 */
router.get(
  '/:postId/comments',
  commentsController.getCommentsByPostId.bind(commentsController)
);

export default router;
