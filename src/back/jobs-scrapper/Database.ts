import mongoose from 'mongoose';
import {JobOffer} from '../api/models/offersModel';
import Job from './Job';

export default class Database {
  static readonly DB_URL = 'mongodb://localhost/jobs';
  static async upsertJob(jobObj: Job) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(this.DB_URL, { useNewUrlParser: true });
    }

    const conditions = { position: jobObj.position, company: jobObj.company };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

    JobOffer.findOneAndUpdate(
      conditions,
      jobObj,
      options,
      (err: any, _doc: any,  _result: string) => {
        if (err) throw err;
      }
    );
  }

  static async clearJobOffers() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(this.DB_URL, { useNewUrlParser: true });
      mongoose.connection.db.dropDatabase();
    }
  }
}
