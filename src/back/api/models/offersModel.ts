import mongoose from 'mongoose';

let jobSchema = new mongoose.Schema({
  website: String,
  position: String,
  company: String,
  companyLogo: String,
  portalLogo: String,
  location: String,
  technologies: [
    {
      type: String
    }
  ],
  salary: String,
  link: String,
  addedDate: Date,
  dateCrawled: Date
});

jobSchema.index({ position: 'text', location: 'text' });
let JobOffer = mongoose.model('Job', jobSchema);

export default JobOffer;