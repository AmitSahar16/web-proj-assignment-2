import mongoose from 'mongoose';
import { IPost } from '../types';

const postSchema = new mongoose.Schema<IPost>(
  {
    message: {
      type: String,
      required: false,
    },
    user: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', postSchema, 'posts');
