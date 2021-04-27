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
import Linkedin from './sites/Linkedin';

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
        new JobsPl(this.browser),
        new Linkedin()
      ];
    }
  }

  async start() {
    let downloads: Promise<void>[] = [];
    console.log(`Started fetching at ${new Date().toLocaleString()}`);
    await Database.clearJobOffers();

    await Promise.all(
      this.sitesToFetch.map(async site => {
        if (await this.isSiteOnline(site)) {
          downloads.push(this.fetchJobOffers(site));
        }
      })
    );

    await Promise.all(downloads);
    console.log(
      `${new Date().toLocaleString()}: Fetched ${
        this.fetchedOffers
      } offers from ${this.sitesToFetch.length} sites. 😎`
    );
  }

  private async fetchJobOffers(site: Site) {
    console.log(` ⬇️ Started fetching from the ${site.name}`);
    console.time(site.name);
    try {
      const jobOffers = await site.getJobs();

      console.log(`Fetched ${jobOffers.length} records from the ${site.name}`);
      this.fetchedOffers += jobOffers.length;
      jobOffers.forEach(async job => { // @TODO Think about this
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
    return new Promise((resolve, reject) => {
      https
        .get(site.endpointAddress, () => {
          console.info(`🌐 ${site.name} is online`);
          return resolve(true);
        })
        .on('error', () => {
          console.warn(`🔻 ${site.name} is offline`);
          return reject(false);
        });
    });
  }
}
