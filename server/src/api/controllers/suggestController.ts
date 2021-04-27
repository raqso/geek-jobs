import * as express from 'express';
import mongoose from 'mongoose';
import { JobOffer } from '../models/offersModel';

export class SuggestController {
  readonly DB_URL = 'mongodb://localhost/jobs';

  public async positionSuggestions(
    _text: string,
    _req: express.Request,
    res: express.Response
  ) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }
    JobOffer.distinct('position', { position: {'$regex': _text, '$options': 'i'}}, this.sendResponse(res));
  }

  public async locationSuggestions(
    _text: string,
    _req: express.Request,
    res: express.Response
  ) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }

    JobOffer.distinct('location', { location: {'$regex': _text, '$options': 'i'}}, this.sendResponse(res));
  }

  private sendResponse(res: express.Response) {
    return (error: any, result: any) => {
      if (error) {
        res.send(error);
      }
      else {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.json(result);
      }
    };
  }
}

export const suggestController = new SuggestController();
