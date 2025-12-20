import { Request, Response } from 'express';
import { Model } from 'mongoose';

export class BaseController<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    try {
      if (req.query.name) {
        const entities = await this.model.find({ name: req.query.name });
        
        res.send(entities);
      } else {
        const entities = await this.model.find();

        res.send(entities);
      }
    } catch (err) {
      console.error(`error get all ${this.model.modelName}`, err);
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const entity = await this.model.findById(req.params.id);

      res.send(entity);
    } catch (err) {
      console.error(`error get by id ${this.model.modelName}`, err);
      res.status(500).json({ message: err.message });
    }
  }

  async post(req: Request, res: Response) {
    try {
      const entity = await this.model.create(req.body);

      res.status(201).send(entity);
    } catch (err) {
      console.error(`error post ${this.model.modelName}`, err);
      res.status(409).json({ message: err.message });
    }
  }

  async updateById(req: Request, res: Response) {
    try {
      const entity = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.send(entity);
    } catch (err) {
      console.error(`error update ${this.model.modelName}`, err);
      res.status(409).json({ message: err.message });
    }
  }

  async deleteById(req: Request, res: Response) {
    try {
      const entity = await this.model.findByIdAndDelete(req.params.id);

      res.send(entity);
    } catch (err) {
      console.error(`error delete ${this.model.modelName}`, err);
      res.status(409).json({ message: err.message });
    }
  }
}

const createController = <T>(model: Model<T>) => {
  return new BaseController<T>(model);
};

export default createController;
