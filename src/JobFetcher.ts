import * as puppeteer from 'puppeteer';
import Database from './Database';
import ForProgrammers from './sites/forProgrammers';
import NoFulffJobs from './sites/noFluffJobs';
import JustJoinIt from './sites/justjoin';
import Jobviously from './sites/Jobviously';

export default class JobFetcher {
  browser: puppeteer.Browser;
  sitesToFetch: Site[] = [];

  constructor(browser: puppeteer.Browser, sites?: Site[]) {
    this.browser = browser;
    if (sites) {
      this.sitesToFetch = sites;
    }
    else {
      this.sitesToFetch = [
        new Jobviously(),
        new JustJoinIt(),
        new ForProgrammers(this.browser),
        new NoFulffJobs()
      ];
    }
  }

  async start() {
    this.sitesToFetch.forEach(async (site) => this.fetchJobOffers(site));
  }

  private async fetchJobOffers(site: Site) {
    let jobOffers = await site.getJobs();
    console.log(`Fetched ${jobOffers.length} records from the ${site.name}`);
    jobOffers.forEach(job => {
      Database.upsertJob(job);
    });
    console.log(`Inserted ${jobOffers.length} records from the ${site.name} to the db`);
  }
}