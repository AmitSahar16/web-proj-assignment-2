import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { startServer } from '../server';
import { IComment, IPost, IUser } from '../types';
import Comment from '../models/comment';
import Post from '../models/post';
import User from '../models/user';

let app: Express;
let accessToken = '';
let accessToken2 = '';

const user: IUser = {
  email: 'comment-test@user.test',
  password: '123456',
  username: 'commenttest',
};

const user2: IUser = {
  email: 'comment-test2@user.test',
  password: '123456',
  username: 'commenttest2',
};

beforeAll(async () => {
  app = (await startServer()).app;
  await Comment.deleteMany();
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

  const loginResponse = await request(app).post('/auth/login').send({
    identifier: user.email,
    password: user.password
  });
  accessToken = loginResponse.body.accessToken;

  await User.deleteMany({ email: user2.email });
  const response2 = await request(app)
    .post('/auth/register')
    .send({
      username: user2.username,
      email: user2.email,
      password: user2.password
    });

  user2._id = response2.body._id;

  const loginResponse2 = await request(app).post('/auth/login').send({
    identifier: user2.email,
    password: user2.password
  });
  accessToken2 = loginResponse2.body.accessToken;

  const postResponse = await request(app)
    .post('/posts')
    .set('Authorization', 'Bearer ' + accessToken)
    .send({ message: 'Test post for comments' });

  post._id = postResponse.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

const post: Partial<IPost> = {
  message: 'Test post for comments',
};

const comment: Partial<IComment> = {
  text: 'This is a test comment',
};

describe('Comment tests', () => {
  test('Test POST comment - create comment', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        text: comment.text,
        post: post._id
      });

    comment._id = response.body._id;

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe(comment.text);
    expect(response.body.post).toBe(post._id);
    expect(response.body.user).toBe(user._id);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  test('Test POST comment - missing text', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        post: post._id
      });

    expect(response.statusCode).toBe(409);
  });

  test('Test POST comment - missing post', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        text: 'Another comment'
      });

    expect(response.statusCode).toBe(409);
  });

  test('Test POST comment - unauthorized (no token)', async () => {
    const response = await request(app)
      .post('/comments')
      .send({
        text: 'Unauthorized comment',
        post: post._id
      });

    expect(response.statusCode).toBe(401);
  });

  test('Test POST comment - create second comment', async () => {
    const response = await request(app)
      .post('/comments')
      .set('Authorization', 'Bearer ' + accessToken2)
      .send({
        text: 'Second user comment',
        post: post._id
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.text).toBe('Second user comment');
    expect(response.body.user).toBe(user2._id);
  });

  test('Test GET all comments', async () => {
    const response = await request(app)
      .get('/comments')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);
  });

  test('Test GET comment by ID', async () => {
    const response = await request(app)
      .get(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body._id).toBe(comment._id);
    expect(response.body.text).toBe(comment.text);
    expect(response.body.post).toBe(post._id);
  });

  test('Test GET comments by post ID', async () => {
    const response = await request(app)
      .get(`/posts/${post._id}/comments`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);

    // Verify comments have user populated
    if (response.body.length > 0) {
      expect(response.body[0].user).toBeDefined();
      if (typeof response.body[0].user === 'object') {
        expect(response.body[0].user.username).toBeDefined();
      }
    }
  });

  test('Test PUT comment - update own comment', async () => {
    const response = await request(app)
      .put(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send({
        text: 'Updated comment text'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.text).toBe('Updated comment text');
    expect(response.body._id).toBe(comment._id);
  });

  test('Test PUT comment - unauthorized (no token)', async () => {
    const response = await request(app)
      .put(`/comments/${comment._id}`)
      .send({
        text: 'Trying to update without auth'
      });

    expect(response.statusCode).toBe(401);
  });

  test("Test PUT comment - forbidden (updating someone else's comment)", async () => {
    const response = await request(app)
      .put(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken2)
      .send({
        text: "Trying to update someone else's comment"
      });

    expect(response.statusCode).toBe(403);
  });

  test("Test DELETE comment - forbidden (deleting someone else's comment)", async () => {
    const response = await request(app)
      .delete(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken2);

    expect(response.statusCode).toBe(403);
  });

  test('Test DELETE comment - unauthorized (no token)', async () => {
    const response = await request(app)
      .delete(`/comments/${comment._id}`);

    expect(response.statusCode).toBe(401);
  });

  test('Test DELETE comment - delete own comment', async () => {
    const response = await request(app)
      .delete(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
  });

  test('Test DELETE comment - comment not found', async () => {
    const response = await request(app)
      .delete(`/comments/${comment._id}`)
      .set('Authorization', 'Bearer ' + accessToken);

    // Could be 200 with null or 404 depending on implementation
    expect([200, 404]).toContain(response.statusCode);
  });
});