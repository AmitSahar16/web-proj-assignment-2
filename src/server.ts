import express, { Express } from 'express';
import { configExpress } from './config/express';
import { configMongo } from './config/mongo';

export const startServer = async (): Promise<{ app: Express, port: number }> => {
    const port = Number(process.env.PORT) || 3000;
    const app = express();

    configExpress(app, port);
    await configMongo();

    return { app, port };
}