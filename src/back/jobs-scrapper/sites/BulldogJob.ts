import { Browser } from 'puppeteer';
import Job from '../Job';

export default class BulldogJob implements Site {
  readonly name = 'BulldogJob';
  readonly logoImage = 'https://cdn.bulldogjob.com/assets/logo-6d85aa7138552c5b466f9a4fb26785893cceb34e7b344915bba0392dd125287a.png';
  readonly address = 'https://bulldogjob.pl/';
  readonly endpointAddress =
    'https://bulldogjob.pl/companies/jobs?mode=plain&page=';
  browser: Browser;
  page: any;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  async getJobs() {
    let jobOffers: Job[] = [];
    let pageNumber = 1;

    await this.openNewBrowserPage();
    await this.goToNextPage(pageNumber);

    let isLast = await this.isLastPage();
    while (!isLast) {
      jobOffers.push(...(await this.getJobsForThePage()));
      pageNumber++;
      const [] = await Promise.all([
        this.page.waitForNavigation(),
        this.goToNextPage(pageNumber)
      ]);

      isLast = await this.isLastPage();
    }

    await this.page.close();
    return jobOffers;
  }

  async goToNextPage(pageNumber: number) {
    await this.page.waitFor(2 * 1000);
    await this.page.goto(this.endpointAddress + pageNumber);
  }

  private async openNewBrowserPage() {
    this.page = await this.browser.newPage();
    // await this.setFetchingHtmlOnly();
  }

  /* private async setFetchingHtmlOnly() {
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
  } */

  private async isLastPage() {
    const offersListSelector = '#search-result > div > section > ul';

    let offersOnPage = await this.page.evaluate((sel: string) => {
      let element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.childElementCount : 0;
    }, offersListSelector);

    return offersOnPage === 0;
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
      const companySelector = this.selectors.listCompanySelector.replace(
        'INDEX',
        i.toString()
      );
      const companyLogoSelector = this.selectors.listCompanyLogoSelector.replace(
        'INDEX',
        i.toString()
      );
      const citySelector = this.selectors.listCitySelector.replace(
        'INDEX',
        i.toString()
      );
      const technologiesSelector = this.selectors.listTechnologiesSelector.replace(
        'INDEX',
        i.toString()
      );
      const addedDateSelector = this.selectors.listAddedDateSelector.replace(
        'INDEX',
        i.toString()
      );

      let position = await this.page.evaluate((sel: string) => {
        let element = document.querySelector(sel) as HTMLAnchorElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        let offerLink = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        let company = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, companySelector);

        let companyLogo = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        let location = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, citySelector);

        let technologies = await this.page.evaluate((sel: string) => {
            let element = document.querySelector(sel) as HTMLUListElement;
            return element ? element.innerText : null;
          }, technologiesSelector);

        let addedDate = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText.trim() : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getDateObject(addedDate),
          company: company,
          companyLogo: companyLogo,
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          technologies: this.getTechnologiesArray(technologies),
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getDateObject(stringDate: string) {
    if (stringDate) {
      const splittedDate = stringDate.split('.');
      const year = parseInt(splittedDate[2]);
      const month = parseInt(splittedDate[1]) - 1;
      const day = parseInt(splittedDate[0]);

      const date = new Date(year, month, day);

      if (this.isDatevalid(date)) {
        return date;
      }
    }
    return null;
  }

  private isDatevalid(dateObj: Date) {
    return !isNaN(dateObj.getTime());
  }

  private getTechnologiesArray(text: string) {
    if (text) {
        return text.split(' ');
    }
    else {
        return [];
    }
  }

  readonly selectors = {
    listPositionSelector:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > h2 > a',
    listCompanySelector:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > p > span.pop.desktop',
    listCompanyLogoSelector:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.image > a > img',
    listCitySelector:
      '#search-result > div > section > ul > li:nth-child(13) > div.description > div > p > span.pop-mobile',
    listAddedDateSelector:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > p > span.inline-block',
    listTechnologiesSelector: '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > ul',
      lengthSelectorClass: '#search-result > div > section > ul > li'
  };
}
