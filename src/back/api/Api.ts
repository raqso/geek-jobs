import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

import { offersRoutes } from './routes/offersRoutes';
import Database from '../jobs-scrapper/Database';
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

    this.app.use('/', offersRoutes);
  }
}

export default new Api().app;
