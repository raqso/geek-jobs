import mongoose from 'mongoose';
import JobOffer from './models/job';

export default class Database {
  static readonly DB_URL = 'mongodb://localhost/jobs';
  static upsertJob(jobObj: Job) {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(this.DB_URL, { useNewUrlParser: true });
    }

    // if this email exists, update the entry, don't insert
    let conditions = { position: jobObj.position, company: jobObj.company };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };

    JobOffer.findOneAndUpdate(
      conditions,
      jobObj,
      options,
      (err: Error, _result: string) => {
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
