"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const comments_controller_1 = __importDefault(require("../controllers/comments_controller"));
const auth_1 = __importDefault(require("../middleware/auth"));
const ownership_1 = require("../middleware/ownership");
const router = express_1.default.Router();
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
router.get('/', comments_controller_1.default.get.bind(comments_controller_1.default));
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
router.get('/:id', comments_controller_1.default.getById.bind(comments_controller_1.default));
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
router.post('/', auth_1.default, comments_controller_1.default.create.bind(comments_controller_1.default));
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
router.put('/:id', auth_1.default, ownership_1.checkCommentOwnership, comments_controller_1.default.updateCommentById.bind(comments_controller_1.default));
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
router.delete('/:id', auth_1.default, ownership_1.checkCommentOwnership, comments_controller_1.default.deleteById.bind(comments_controller_1.default));
exports.default = router;
//# sourceMappingURL=comments_route.js.map