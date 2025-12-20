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
    comments: [
      {
        user: { type: String, required: true, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', postSchema, 'posts');
