import mongoose from 'mongoose';
import { JobOffer } from '../api/models/offersModel';
import Job from './Job';

export default class Database {
  static readonly DB_URL = 'mongodb://localhost/jobs';
  static async upsertJob(jobObj: Job) {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
    }

    if (jobObj && jobObj.addedDate) {
      jobObj.addedDate = Database.randomizeTime(jobObj.addedDate);
    }

    const conditions = { position: jobObj.position, company: jobObj.company };
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false
    };

    JobOffer.findOneAndUpdate(
      conditions,
      jobObj,
      options,
      (err: any, _doc: any, _result: string) => {
        if (err) throw err;
      }
    );
  }

  static async clearJobOffers() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        this.DB_URL,
        { useNewUrlParser: true }
      );
      mongoose.connection.db.dropDatabase();
    }
  }

  public static randomizeTime(addedDate?: Date) {
    if (addedDate) {
      addedDate.setHours(this.randomHour);
      addedDate.setMinutes(this.randomMinutes);
      return addedDate;
    }
    return null;
  }

  private static get randomHour() {
    return Math.floor(Math.random() * (24 + 1) + 1);
  }

  private static get randomMinutes() {
    return Math.floor(Math.random() * (60 + 1) + 1);
  }
}
