import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, getRefreshTokenFromHeader, verifyRefreshToken } from '../utils/authUtils';

const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    console.error('missing one of the following: email, password, username');

    return res
      .status(400)
      .send('missing one of the following: email, password, username');
  }

  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      console.error('email already exists');

      return res.status(409).send('email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email: email,
      password: encryptedPassword,
      username: username,
    });

    console.info('new user added to db');

    return res.status(201).send(user);
  } catch (err) {
    console.error('error while trying to register');
    return res.status(500).send('error while trying to register');
  }
};

const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    console.error('missing identifier or password');
    return res.status(400).send('missing identifier or password');
  }

  try {
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { username: identifier };

    const user = await User.findOne(query);

    if (!user) {
      console.error('user not found');
      return res.status(401).send('invalid credentials');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.error('password is incorrect');
      return res.status(401).send('invalid credentials');
    }

    const accessToken = generateAccessToken({ _id: user._id });
    const refreshToken = generateRefreshToken({ _id: user._id });

    user.refreshTokens = [refreshToken];

    await user.save();

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (err) {
    console.error('error while trying to login');
    return res.status(500).send('error while trying to login');
  }
};

const logout = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromHeader(req.headers);

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const tokenPayload = verifyRefreshToken(refreshToken);
    const user = await User.findOne(tokenPayload);

    if (!user) {
      return res.sendStatus(401);
    }

    if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
      user.refreshTokens = [];
      await user.save();

      return res.sendStatus(401);
    } else {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );

      await user.save();
      return res.sendStatus(200);
    }
  } catch (err) {
    console.error('error while trying to logout', err);
    return res.status(500).send('error while trying to logout');
  }
};

const refresh = async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromHeader(req.headers);

  if (!refreshToken) {
    console.error('No refresh token provided');
    return res.sendStatus(401);
  }

  try {
    const tokenPayload = verifyRefreshToken(refreshToken);

    const user = await User.findById(tokenPayload._id);

    if (!user) {
      console.error('User not found for refresh token');
      return res.sendStatus(401);
    }

    if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
      console.error('Refresh token not found in user tokens array');
      user.refreshTokens = [];
      await user.save();
      return res.sendStatus(401);
    }

    const payload = { _id: tokenPayload._id };
    const accessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );

    user.refreshTokens.push(newRefreshToken);
    await user.save();

    return res.status(200).send({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error('error while trying to refresh', err);
    return res.status(500).send('error while trying to refresh');
  }
};

export default {
  register,
  login,
  logout,
  refresh,
};
