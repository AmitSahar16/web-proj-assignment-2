import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';
import Post from '../models/post';
import Comment from '../models/comment';

export const checkPostOwnership = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.user.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Forbidden: You can only modify your own posts' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

export const checkCommentOwnership = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.user.toString() !== userId.toString()) {
      res.status(403).json({ message: 'Forbidden: You can only modify your own comments' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    return;
  }
};

