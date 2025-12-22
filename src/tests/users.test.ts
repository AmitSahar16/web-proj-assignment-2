import request from 'supertest';
import mongoose from 'mongoose';
import { Express } from 'express';
import { startServer } from '../server';
import { IUser } from '../types';
import User from '../models/user';

let app: Express;
let accessToken: string;

const user: IUser = {
  email: 'test@user.test',
  password: '123456',
  username: 'test',
};

beforeAll(async () => {
  app = (await startServer()).app;
  await User.deleteMany();

  User.deleteMany({ email: user.email });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User tests', () => {
  const addUser = async (user: IUser) => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: user.username,
        email: user.email,
        password: user.password
      });
    user._id = response.body._id;

    expect(response.statusCode).toBe(201);

    const response2 = await request(app).post('/auth/login').send({
      identifier: user.email,
      password: user.password
    });
    accessToken = response2.body.accessToken;

    expect(response2.statusCode).toBe(200);
  };

  test('Test Get Me - not authenticated', async () => {
    const response = await request(app).get('/users/me');

    expect(response.statusCode).toBe(401);
  });

  test('Test Post User', async () => {
    await addUser(user);
  });

  test('Test Get Me - authenticated', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(user.username);
    expect(response.body._id).toBe(user._id);
    expect(response.body.email).toBe(user.email);
  });

  test('Test Post duplicate User', async () => {
    const response = await request(app).post('/auth/register').send(user);

    expect(response.statusCode).toBe(409);
  });

  test('Test PUT /users', async () => {
    const updatedUser = { ...user, username: 'User123' };
    const response = await request(app)
      .put('/users')
      .send({
        email: updatedUser.email,
        password: updatedUser.password,
        username: updatedUser.username
      })
      .set('Authorization', 'Bearer ' + accessToken);

    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(updatedUser.username);
  });
});
