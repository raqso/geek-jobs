import * as express from 'express';
import mongoose from 'mongoose';
import { JobOffer }from '../models/offersModel';
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
    }
    JobOffer.find({}, (err: Error, result: string) => {
      if (err) {
        res.send(error);
      } else {
        res.json(result);
      }
    });
  }

  public async testOffers(_req: express.Request, res: express.Response) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }
    // {$and: [{position: /developer/}, {location: /Wrocław/}]}
    JobOffer.find({location: /Wrocław/}, null, {sort: {addedDate: -1}}, (err: any, result: any) => {
      if (err) {
        res.send(error);
      } else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.json(result);
      }
    });
  }

  public async offers(positionParam: string, locationParam: string, _req: express.Request, response: express.Response) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }

    JobOffer.find({$and: [{position: {'$regex': positionParam, '$options': 'i'}}, {location: {'$regex': locationParam, '$options': 'i'}}]}, null, {sort: {addedDate: -1}}, (error: any, result: any) => {
      if (error) {
        response.send(error);
      } else {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        response.json(result);
      }
    });
  }
}

export const offersController = new OffersController();
