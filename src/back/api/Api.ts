import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apicache from 'apicache';

import { offersRoutes } from './routes/offersRoutes';
import Database from '../jobs-scrapper/Database';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
const cache = apicache.middleware;

class Api {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private async config() {
    await Database.connectIfNecessary();
    this.app.use(bodyParser.json());
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(
      bodyParser.urlencoded({
        extended: false
      })
    );
    this.app.set('trust proxy', 1);
    // @ts-ignore
    this.app.use('/', apiLimiter, cache('5 minutes'), offersRoutes);
  }
}

export default new Api().app;
