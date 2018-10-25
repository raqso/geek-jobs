const mongoose = require('mongoose');

let jobSchema = new mongoose.Schema({
  website: String,
  position: String,
  company: String,
  companyLogo: String,
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

let JobOffer = mongoose.model('Job', jobSchema);

export default JobOffer;
