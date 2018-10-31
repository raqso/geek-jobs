import { Browser } from 'puppeteer';
import { isString } from 'util';
import Job from '../Job';

export default class Olx implements Site {
  name = 'Olx';
  logoImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/OLX_Logo.jpg/720px-OLX_Logo.jpg';
  address = 'https://olx.pl';
  endpointAddress = 'https://www.olx.pl/praca/informatyka/';
  browser: Browser;
  page: any;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  async getJobs() {
    let jobOffers: Job[] = [];

    await this.openNewBrowserPage();
    await this.page.goto(this.endpointAddress);

    let isLast = await this.isLastPage();
    while (!isLast) {
      jobOffers.push(...(await this.getJobsForThePage()));
      await this.goToNextPage();
      isLast = await this.isLastPage();
    }

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
      const salaryFromSelector = this.selectors.listSalarySelectorFrom.replace(
        'INDEX',
        i.toString()
      );
      const salaryToSelector = this.selectors.listSalarySelectorTo.replace(
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

        let location = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, citySelector);

        let salaryFrom = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, salaryFromSelector);

        let salaryTo = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, salaryToSelector);

        let addedDate = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getOfferDate(addedDate),
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          salary: {
            from: this.getSalary(salaryFrom),
            to: this.getSalary(salaryTo)
          },
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  async goToNextPage() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(this.selectors.lastPageButtonSelector)
    ]);
  }

  private async isLastPage() {
    return await this.page.evaluate((sel: string) => {
      let element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? false : true;
    }, this.selectors.lastPageButtonSelector + ' > a');
  }

  private getSalary(salaryText: string) {
    let salary = '';
    if (salaryText && salaryText.split(' ').length) {
      const splitted = salaryText.split(' ');
      splitted.forEach(part => {
        if (!isNaN(Number(part))) {
          salary += part;
        }
      });
    }
    return salary ? Number(salary) : undefined;
  }

  private getOfferDate(created: string) {
    if (created && isString(created)) {
      const splittedString = created.split(' ');
      const day = Number(splittedString[0]);
      const monthCode = splittedString[1];
      let month: number;
      let todayDate = new Date();

      if (splittedString[0] === 'dzisiaj') {
        return todayDate;
      } else if (splittedString[0] === 'wczoraj') {
        todayDate.setDate(todayDate.getDate() - 1);
        return todayDate;
      } else {
        switch (monthCode) {
          case 'sty': {
            month = 0;
            break;
          }
          case 'lut': {
            month = 1;
            break;
          }
          case 'mar': {
            month = 2;
            break;
          }
          case 'kwi': {
            month = 3;
            break;
          }
          case 'maj': {
            month = 4;
            break;
          }
          case 'cze': {
            month = 5;
            break;
          }
          case 'lip': {
            month = 6;
            break;
          }
          case 'sie': {
            month = 7;
            break;
          }
          case 'wrz': {
            month = 8;
            break;
          }
          case 'paź': {
            month = 9;
            break;
          }
          case 'lis': {
            month = 10;
            break;
          }
          case 'gru': {
            month = 11;
            break;
          }
          default: {
            return null;
            break;
          }
        }

        todayDate.setMonth(month);
        todayDate.setDate(day);
        return todayDate;
      }
    } else {
      return null;
    }
  }

  readonly selectors = {
    lastPageButtonSelector:
      '#body-container > div > div > div.pager.rel.clr > span.fbold.next.abs.large',
    lengthSelectorClass: 'tr.wrap',
    listPositionSelector:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr > td.title-cell > div > h3 > a',
    listCitySelector:
      'tr.wrap:nth-child(INDEX) >td > div > table > tbody > tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(1) > span',
    listSalarySelectorFrom:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > div > span:nth-child(1)',
    listSalarySelectorTo:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > div > span:nth-child(2)',
    listAddedDateSelector:
      'tr.wrap:nth-child(INDEX) >td > div > table > tbody > tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(2) > span'
  };
}
