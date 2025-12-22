import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { startServer } from '../server';
import User from '../models/user';
import { IUser } from '../types';

let app: Express;

const user: IUser = {
  email: 'test@user.test',
  password: '123456',
  username: 'test',
};

beforeAll(async () => {
  process.env.ACCESS_TOKEN_EXPIRY = '3s';
  app = (await startServer()).app;
  await User.deleteMany({ email: user.email });
  await User.deleteMany({ email: user.email + '1' });
});

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
let newRefreshToken: string;

describe('Auth tests', () => {
  test('Test Register', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: user.username,
        email: user.email,
        password: user.password
      });

    expect(response.statusCode).toBe(201);
  });

  test('Test Register exist email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: user.username,
        email: user.email,
        password: user.password
      });

    expect(response.statusCode).toBe(409);
  });

  test('Test Register missing password', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: user.username,
        email: user.email
      });

    expect(response.statusCode).toBe(400);
  });

  test('Test Login', async () => {
    const response = await request(app).post('/auth/login').send({
      identifier: user.email,
      password: user.password
    });

    expect(response.statusCode).toBe(200);

    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;

    expect(accessToken).toBeDefined();
  });

  test('Test forbidden access without token', async () => {
    const response = await request(app).get('/users/me');

    expect(response.statusCode).toBe(401);
  });

  test('Test access with valid token', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
  });

  test('Test access with invalid token', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer 1' + accessToken);

    expect(response.statusCode).toBe(401);
  });

  test('Test access after timeout of token', async () => {
    await new Promise((resolve) => setTimeout(() => resolve('done'), 4000));

    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(401);
  });

  test('Test refresh token', async () => {
    // Get a fresh access and refresh token first
    const loginResponse = await request(app).post('/auth/login').send({
      identifier: user.email,
      password: user.password
    });
    const freshRefreshToken = loginResponse.body.refreshToken;

    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'Bearer ' + freshRefreshToken)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.refreshToken).toBeDefined();

    const newAccessToken = response.body.accessToken;
    newRefreshToken = response.body.refreshToken;

    const response2 = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer ' + newAccessToken);

    expect(response2.statusCode).toBe(200);
  });

  test('Test double use of refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'Bearer ' + refreshToken)
      .send();

    expect(response.statusCode).not.toBe(200);

    const response1 = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'Bearer ' + newRefreshToken)
      .send();

    expect(response1.statusCode).not.toBe(200);
  });
});
