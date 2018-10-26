import * as express from 'express';
import mongoose from 'mongoose';
import JobOffer from '../models/offersModel';
import { error } from 'util';

export class OffersController {
  readonly DB_URL = 'mongodb://localhost/jobs';

  public root(_req: express.Request, res: express.Response) {
    res.status(200).send({
      message: 'GET request successful!!'
    });
  }

  public async allOffers(_req: express.Request, res: express.Response) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
      JobOffer.find({}, (err: Error, result: string) => {
        if (err) {
          res.send(error);
        } else {
          res.json(result);
        }
      });
    }
  }
}

export const offersController = new OffersController();
