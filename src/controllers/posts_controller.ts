import Post from '../models/post';
import { IAuthRequest, IPost } from '../types';
import { BaseController } from './base_controller';
import { Request, Response } from 'express';


class PostsController extends BaseController<IPost> {
  constructor() {
    super(Post);
  }

  async create(req: IAuthRequest, res: Response) {
    await super.post(req, res);
  }

  async updatePostById(req: IAuthRequest, res: Response) {
    req.body.user = req.user._id;

    await super.updateById(req, res);
  }

  async getPostById(req: Request, res: Response) {
    try {
      const post = await (
        await this.model.findById(req.params.id).populate("user")
      ).populate("comments.user");

      res.send(post);
    } catch (err) {
      console.error("error while trying to get post by id");
      res.status(500).json({ message: err.message });
    }
  }

  async getPostsByMe(req: IAuthRequest, res: Response) {
    try {
      const posts = await this.model
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("user");

      res.send(posts);
    } catch (err) {
      console.error("error while trying to get posts by user id");
      res.status(500).json({ message: err.message });
    }
  }

  async addCommentToPost(req: IAuthRequest, res: Response) {
    const user = req.user._id;
    const postId = req.params.postId;

    try {
      const post = await this.model.findById(postId);
      post.comments = [...post.comments, { ...req.body, user }];

      await post.save();

      const populatedPost = await post.populate("comments.user");

      res.send(populatedPost.comments);
    } catch (err) {
      console.error("error while adding comment to a post");
      res.status(409).json({ message: err.message });
    }
  }
}

export default new PostsController();
