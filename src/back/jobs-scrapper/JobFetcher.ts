import * as puppeteer from 'puppeteer';
import Database from './Database';
import ForProgrammers from './sites/ForProgrammers';
import NoFulffJobs from './sites/NoFluffJobs';
import JustJoinIt from './sites/JustJoinIT';
import Jobviously from './sites/Jobviously';
import Pracuj from './sites/Pracuj';
import BulldogJob from './sites/BulldogJob';
import Olx from './sites/Olx';

export default class JobFetcher {
  browser: puppeteer.Browser;
  sitesToFetch: Site[] = [];
  fetchedOffers = 0;

  constructor(browser: puppeteer.Browser, sites?: Site[]) {
    this.browser = browser;
    if (sites) {
      this.sitesToFetch = sites;
    } else {
      this.sitesToFetch = [
        new BulldogJob(this.browser),
        new Pracuj(this.browser),
        new Jobviously(),
        new JustJoinIt(),
        new ForProgrammers(this.browser),
        new NoFulffJobs(),
        new Olx(this.browser)
      ];
    }
  }

  async start() {
    let downloads: Promise<void>[] = [];

    Database.clearJobOffers();
    this.sitesToFetch.forEach(site => {
      downloads.push(this.fetchJobOffers(site));
    });

    await Promise.all(downloads);
    console.log(`Fetched ${this.fetchedOffers} offers from ${this.sitesToFetch.length} sites. 😎`);
  }

  private async fetchJobOffers(site: Site) {
    console.log(` ⬇️ Started fetching from the ${site.name}`);
    let jobOffers = await site.getJobs();
    console.log(`Fetched ${jobOffers.length} records from the ${site.name}`);
    this.fetchedOffers += jobOffers.length;
    await jobOffers.forEach(async job => {
      await Database.upsertJob(job);
    });
    console.log(
      `✔️ Inserted ${jobOffers.length} records from the ${site.name} to the db`
    );
  }
}
