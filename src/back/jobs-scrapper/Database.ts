import mongoose from 'mongoose';
import { JobOffer } from '../api/models/offersModel';
import Job from './Job';

export default class Database {
  static readonly DB_URL = 'mongodb://localhost/jobs';
  static async upsertJob(jobObj: Job) {
    const conditions = { position: jobObj.position, company: jobObj.company };
    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      useFindAndModify: false
    };

    if (jobObj && jobObj.addedDate) {
      jobObj.addedDate = Database.randomizeTime(jobObj.addedDate);
    }

    return new Promise( async (resolve, reject) => {
      await Database.connectIfNecessary();

      JobOffer.findOneAndUpdate(
        conditions,
        jobObj,
        options,
        (error: any, _doc: any, _result: string) => {
          if (!error) {
            resolve('Record has been added');
          }
          else {
            reject(error);
          }
        }
      );
    });
  }

  private static async connectIfNecessary() {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(this.DB_URL, { useNewUrlParser: true });
    }
  }

  static async clearJobOffers() {
    await Database.connectIfNecessary();
    await mongoose.connection.db.dropDatabase();
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
