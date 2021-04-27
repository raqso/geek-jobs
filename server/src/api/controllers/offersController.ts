import * as express from 'express';
import mongoose from 'mongoose';
import { JobOffer } from '../models/offersModel';
import { isString } from 'util';

export type OffersParameters = {
  position?: string;
  location?: string;
  website?: string;
  technologies?: string;
  salaryFrom?: number;
  salaryTo?: number;
};

export class OffersController {
  readonly DB_URL = 'mongodb://localhost/jobs';

  public root(_req: express.Request, res: express.Response) {
    res.status(200).send({
      message: 'API is working'
    });
  }

  public async allOffers(_req: express.Request, res: express.Response) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }
    JobOffer.find({}, (error: Error, result: string) => {
      if (error) {
        res.send(error);
      } else {
        res.json(result);
      }
    });
  }

  public async offers(
    parameters: OffersParameters,
    _req: express.Request,
    response: express.Response
  ) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }

    JobOffer.find(
      { $and: this.prepareQuery(parameters) },
      null,
      { sort: { addedDate: -1 } },
      (error: any, result: any) => {
        if (error) {
          response.send(error);
        } else {
          response.header('Access-Control-Allow-Origin', '*');
          response.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
          );
          response.json(result);
        }
      }
    );
  }

  private prepareQuery(parameters: OffersParameters) {
    const queryConditions: Object[] = [];
    Object.entries(parameters).forEach(([key, value]) => {
      switch (key) {
        case 'position':
        case 'location':
        case 'website': {
          queryConditions.push({
            [key]: { $regex: value || '', $options: 'i' }
          });
          break;
        }
        case 'salaryFrom': {
          queryConditions.push({
            'salary.from': {
              $gte: parameters.salaryFrom
            }
          });
          break;
        }
        case 'salaryTo': {
          queryConditions.push({
            'salary.to': {
              $lte: parameters.salaryTo
            }
          });
          break;
        }
        case 'technologies': {
          if (value && isString(value)) {
            queryConditions.push({
              [key]: {
                $in: value.split(',')
              }
            });
          }
          break;
        }
      }
    });

    return queryConditions;
  }

  public async testOffers(_req: express.Request, res: express.Response) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }

    JobOffer.find(
      { location: /Wrocław/ },
      null,
      { sort: { addedDate: -1 } },
      (error: any, result: any) => {
        if (error) {
          res.send(error);
        } else {
          res.header('Access-Control-Allow-Origin', '*');
          res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
          );
          res.json(result);
        }
      }
    );
  }
}

export const offersController = new OffersController();
