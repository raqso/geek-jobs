import { Browser } from 'puppeteer';
import Job from '../Job';
import Site from '../Site';

export default class CrossWeb implements Site {
  name = 'CrossWeb';
  logoImage =
    'https://crossweb.pl/job/wp-content/themes/kariera/img/crossjob-logo-podstawowe.png';
  address = 'https://crossweb.pl';
  endpointAddress = 'https://crossweb.pl/job/oferty-pracy';
  browser: Browser;
  page: any;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  async getJobs() {
    let jobOffers: Job[] = [];

    await this.openNewBrowserPage();
    await this.page.goto(this.endpointAddress);

    jobOffers.push(...(await this.getJobsForThePage()));

    await this.page.close();
    return jobOffers;
  }

  private async openNewBrowserPage() {
    this.page = await this.browser.newPage();
    await this.setFetchingHtmlOnly();
  }

  private async setFetchingHtmlOnly() {
    await this.page.setRequestInterception(true);
    this.page.on('request', (req: any) => {
      if (
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'image'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  private async getJobsForThePage() {
    let listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthSelectorClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const positionSelector = this.selectors.listPositionSelector.replace(
        'INDEX',
        i.toString()
      );
      const citySelector = this.selectors.listCitySelector.replace(
        'INDEX',
        i.toString()
      );

      const companySelector = this.selectors.listCompanyLogoSelector.replace(
        'INDEX',
        i.toString()
      );
      const technologiesSelector = this.selectors.listTechnologiesSelector.replace(
        'INDEX',
        i.toString()
      );

      let position = await this.page.evaluate((sel: string) => {
        let element = document.querySelector(sel + ' > div') as HTMLDivElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        let offerLink = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        let location = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLDivElement;
          return element ? element.innerText.trim() : null;
        }, citySelector);

        let companyLogo = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companySelector);

        let technologies = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLDivElement;
          return element ? element.innerText : null;
        }, technologiesSelector);

        jobOffers.push({
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          company: this.getCompanyName(companyLogo),
          companyLogo: companyLogo,
          technologies: this.getTechnologies(technologies),
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getCompanyName(logoUrl: string) {
    if (logoUrl) {
      const regexPattern = /(?!Logo|logo)([A-Z^])\D+/g;
      const splitted = logoUrl.split('/');
      if (splitted.length) {
        const fileName = splitted[splitted.length - 1];
        let companyName = regexPattern.exec(fileName);
        if (companyName && companyName.length) {
          return companyName[0].replace('_', '');
        }
      }
    }

    return null;
  }

  private getTechnologies(technologiesText: string) {
      if (technologiesText) {
        return technologiesText.split(', ');
      }
      return [];
  }

  readonly selectors = {
    lengthSelectorClass: '#container > div.tabRow',
    listPositionSelector: '#container > div.tabRow:nth-child(INDEX) > a',
    listCitySelector: '#container > div.tabRow:nth-child(INDEX) > div.city',
    listAddedDateSelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-title > span:nth-child(3)',
    listCompanyLogoSelector:
      '#container > div.tabRow:nth-child(INDEX) > div.logo > img',
    listTechnologiesSelector:
      '#container > div.tabRow:nth-child(INDEX) > div.technology'
  };
}
