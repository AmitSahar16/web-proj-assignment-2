import express from 'express';
import authRoutes from './auth_route';
import userRoutes from './users_route';
import postRoutes from './posts_route';
// import commentRoutes from './comments_route';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/post', postRoutes);
// router.use('/comment', commentRoutes);

export default router;