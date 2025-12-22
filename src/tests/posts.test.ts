import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { startServer } from '../server';
import { IPost, IUser } from '../types';
import Post from '../models/post';
import User from '../models/user';

let app: Express;
let accessToken = '';

const user: IUser = {
  email: 'test@user.test',
  password: '123456',
  username: 'test',
};

beforeAll(async () => {
  app = (await startServer()).app;
  await Post.deleteMany();

  await User.deleteMany({ email: user.email });
  const response = await request(app)
    .post('/auth/register')
    .send({
      username: user.username,
      email: user.email,
      password: user.password
    });

  user._id = response.body._id;
  post.user = user._id;
  const response2 = await request(app).post('/auth/login').send({
    identifier: user.email,
    password: user.password
  });
  accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

const post: Partial<IPost> = {
  message: 'description1',
  user: user._id,
};

describe('post tests', () => {
  test('TEST POST post', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        user: post.user,
        message: post.message
      });
    post._id = response.body._id;

    expect(response.statusCode).toBe(201);
    expect(response.body.user).toBe(user._id);
    expect(response.body.message).toBe(post.message);
  });

  test('Test GET posts', async () => {
    const response = await request(app).get('/posts');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('Test GET post by id', async () => {
    const response = await request(app).get(`/posts/${post._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.user._id).toBe(user._id);
    expect(response.body.message).toBe(post.message);
  });

  test('TEST GET posts of me', async () => {
    const response = await request(app)
      .get('/posts/user/me')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('Test PUT post', async () => {
    const response = await request(app)
      .put(`/posts/${post._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ message: 'my post' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('my post');
  });

  test('Test DELETE post', async () => {
    const response = await request(app)
      .delete(`/posts/${post._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(post._id);
  });
});
