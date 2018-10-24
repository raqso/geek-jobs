import * as puppeteer from 'puppeteer';
import Database from './Database';
import ForProgrammers from './sites/ForProgrammers';
import NoFulffJobs from './sites/NoFluffJobs';
import JustJoinIt from './sites/JustJoinIT';
import Jobviously from './sites/Jobviously';
import Pracuj from './sites/Pracuj';

export default class JobFetcher {
  browser: puppeteer.Browser;
  sitesToFetch: Site[] = [];

  constructor(browser: puppeteer.Browser, sites?: Site[]) {
    this.browser = browser;
    if (sites) {
      this.sitesToFetch = sites;
    } else {
      this.sitesToFetch = [
        new Pracuj(this.browser),
        new Jobviously(),
        new JustJoinIt(),
        new ForProgrammers(this.browser),
        new NoFulffJobs()
      ];
    }
  }

  async start() {
    let downloads: Promise<void>[] = [];

    this.sitesToFetch.forEach(site => {
      downloads.push(this.fetchJobOffers(site));
    });

    await Promise.all(downloads);
    this.browser.close();
  }

  private async fetchJobOffers(site: Site) {
    let jobOffers = await site.getJobs();
    console.log(`Fetched ${jobOffers.length} records from the ${site.name}`);
    jobOffers.forEach(job => {
      Database.upsertJob(job);
    });
    console.log(
      `Inserted ${jobOffers.length} records from the ${site.name} to the db`
    );
  }
}
