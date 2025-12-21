import { Express } from 'express';
import cors from 'cors';
import routes from '../routes';
import { configSwagger } from './swagger';
import express from 'express';

export const configExpress = (app: Express, port: number) => {
  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/', routes);

  configSwagger(app, port);
};