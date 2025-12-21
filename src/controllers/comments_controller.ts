import Comment from '../models/comment';
import { IAuthRequest, IComment } from '../types';
import { BaseController } from './base_controller';
import { Request, Response } from 'express';

class CommentsController extends BaseController<IComment> {
  constructor() {
    super(Comment);
  }

  async create(req: IAuthRequest, res: Response) {
    req.body.user = req.user._id;
    await super.post(req, res);
  }

  async createCommentForPost(req: IAuthRequest, res: Response) {
    try {
      const comment = await this.model.create({
        text: req.body.text,
        post: req.params.postId,
        user: req.user._id
      });

      const populatedComment = await comment.populate('user', 'username email');
      res.status(201).send(populatedComment);
    } catch (err) {
      console.error('error while adding comment to a post');
      res.status(409).json({ message: err.message });
    }
  }

  async getCommentsByPostId(req: Request, res: Response) {
    try {
      const comments = await this.model
        .find({ post: req.params.postId })
        .sort({ createdAt: -1 })
        .populate('user', 'username email');

      res.send(comments);
    } catch (err) {
      console.error('error while trying to get comments by post id');
      res.status(500).json({ message: err.message });
    }
  }

  async updateCommentById(req: IAuthRequest, res: Response) {
    req.body.user = req.user._id;
    await super.updateById(req, res);
  }
}

export default new CommentsController();
