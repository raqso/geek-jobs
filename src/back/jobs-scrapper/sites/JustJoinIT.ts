import { GetData } from '../GetData';
import Job from '../Job';
import Site from '../Site';

export default class JustJoinIt implements Site {
  readonly name = 'Just Join IT';
  readonly logoImage = 'https://bucket.justjoin.it/companies/logos/original/a558c98b3368639ef93fa5c6a1cc94d6ce3b1693.png?1527165365';
  readonly address = 'https://justjoin.it';
  readonly endpointAddress = 'https://justjoin.it/api/offers';

  public async getJobs() {
    let jobOffers: Job[] = [];
    let jobs: JustJoinJob[] | {} = await GetData.getRequest(
      'https://justjoin.it/api/offers'
    );
    jobs = (jobs && typeof(jobs) === 'string') ? JSON.parse(jobs) : [];

    if (jobs && Array.isArray(jobs)) {
      jobs.forEach(job => {
        jobOffers.push(this.createJobOffer(job));
      });
    }
    return jobOffers;
  }

  private createJobOffer(job: JustJoinJob): Job {
    return {
      addedDate: new Date(job.published_at),
      company: job.company_name,
      companyLogo: job.company_logo_url,
      dateCrawled: new Date(),
      link: this.address + '/offers/' + job.id,
      location: job.city,
      position: job.title,
      salary: {
        from: job.salary_from,
        to: job.salary_to,
        currency: job.salary_currency
      },
      technologies: this.getTechnologiesArray(job.skills),
      website: this.name,
      portalLogo: this.logoImage
    } as Job;
  }

  private getTechnologiesArray(skills: Skill[]) {
    let technologies: string[] = [];
    skills.forEach(skill => {
      if (skill.name) {
        technologies.push(skill.name);
      }
    });
    return technologies;
  }
}

export interface JustJoinJob {
  title: string;
  street: string;
  city: string;
  country_code: string;
  address_text: string;
  marker_icon: string;
  remote: boolean;
  company_name: string;
  company_url: string;
  company_size: string;
  experience_level: string;
  salary_from: number;
  salary_to: number;
  salary_currency: string;
  latitude: string;
  longitude: string;
  apply_url: string;
  employment_type: string;
  published_at: string;
  id: string;
  tags: any[];
  company_logo_url: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  level: number;
}