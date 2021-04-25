import express from 'express';
import * as bodyParser from 'body-parser';
import { offersRoutes } from './routes/offersRoutes';
import mongoose from 'mongoose';
import config from '../../config';
class Api {
  public app: express.Application;

  constructor() {
    this.mongoSetup();
    this.app = express();
    this.config();
  }

  private mongoSetup(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(config.mongoUrl, { useNewUrlParser: true });
  }

  private config(): void {
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
