import { Response } from 'express';
import User from '../models/user';
import { IAuthRequest, IUser } from '../types';
import { BaseController } from './base_controller';

class UsersController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  async getUserById(req: IAuthRequest, res: Response) {
    req.params.id = req.user._id;

    await super.getById(req, res);
  }

  async updateUserById(req: IAuthRequest, res: Response) {
    req.params.id = req.user._id;

    await super.updateById(req, res);
  }
}

export default new UsersController();