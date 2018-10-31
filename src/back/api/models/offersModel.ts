import { Schema, Model, model} from 'mongoose';
import Job from '../../jobs-scrapper/Job';

let jobSchema = new Schema({
  website: String,
  position: String,
  company: String,
  companyLogo: String,
  portalLogo: String,
  location: String,
  technologies: [String],
  salary: String,
  link: String,
  addedDate: Date,
  dateCrawled: Date
});

jobSchema.index({ position: 'text', location: 'text' });

export const JobOffer: Model<Job>  = model<Job>('Job', jobSchema);