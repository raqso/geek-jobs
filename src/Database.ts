import mongoose from 'mongoose';
import JobOffer from './models/job';

export default class Database {
  static upsertJob(jobObj: Job) {
    const DB_URL = 'mongodb://localhost/jobs';

    if (mongoose.connection.readyState === 0) {
      mongoose.connect(DB_URL);
    }

    // if this email exists, update the entry, don't insert
    let conditions = { position: jobObj.position, company: jobObj.company };
    let options = { upsert: true, new: true, setDefaultsOnInsert: true };

    JobOffer.findOneAndUpdate(
      conditions,
      jobObj,
      options,
      (err: Error, _result: string) => {
        if (err) throw err;
      }
    );
  }
}
