import * as puppeteer from 'puppeteer';
import https from 'https';
import Database from './Database';
import Site from './Site';
import ForProgrammers from './sites/ForProgrammers';
import NoFulffJobs from './sites/NoFluffJobs';
import JustJoinIt from './sites/JustJoinIT';
import Jobviously from './sites/Jobviously';
import Pracuj from './sites/Pracuj';
import BulldogJob from './sites/BulldogJob';
import Olx from './sites/Olx';
import StackOverflow from './sites/StackOverflow';
import CrossWeb from './sites/CrossWeb';
import InfoPraca from './sites/InfoPraca';
import JobsPl from './sites/JobsPl';

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
        new InfoPraca(this.browser),
        new CrossWeb(this.browser),
        new StackOverflow(this.browser),
        new BulldogJob(this.browser),
        new Pracuj(this.browser),
        new Jobviously(),
        new JustJoinIt(),
        new ForProgrammers(this.browser),
        new NoFulffJobs(),
        new Olx(this.browser),
        new JobsPl(this.browser)
      ];
    }
  }

  async start() {
    let downloads: Promise<void>[] = [];
    console.log(`Started fetching at ${new Date().toLocaleString()}`);
    Database.clearJobOffers();
    this.sitesToFetch.forEach(site => {
      if (this.isSiteOnline(site)) {
        downloads.push(this.fetchJobOffers(site));
      }
    });

    await Promise.all(downloads);
    console.log(
      `${new Date().toLocaleString()}: Fetched ${this.fetchedOffers} offers from ${
        this.sitesToFetch.length
      } sites. 😎`
    );
  }

  private async fetchJobOffers(site: Site) {
    console.log(` ⬇️ Started fetching from the ${site.name}`);
    console.time(site.name);
    try {
      const jobOffers = await site.getJobs();

      console.log(`Fetched ${jobOffers.length} records from the ${site.name}`);
      this.fetchedOffers += jobOffers.length;
      await jobOffers.forEach(async job => {
        await Database.upsertJob(job);
      });
      console.log(
        `✔️ Inserted ${jobOffers.length} records from the ${
          site.name
        } to the db`
      );
    } catch (error) {
      console.warn(
        `Error during getting job offers from the ${site.name} site!` + error
      );
    }
    console.timeEnd(site.name);
  }

  private async isSiteOnline(site: Site) {
    await https
      .get(site.endpointAddress, () => {
        console.info(`🌐 ${site.name} is online`);
        return true;
      })
      .on('error', () => {
        console.warn(`🔻 ${site.name} is offline`);
        return false;
      });
  }
}