import express from 'express';
import * as bodyParser from 'body-parser';
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

    this.app.use(
      bodyParser.urlencoded({
        extended: false
      })
    );

    this.app.use('/api', offersRoutes);
  }
}

export default new Api().app;
