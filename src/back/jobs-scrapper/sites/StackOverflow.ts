import { Browser } from 'puppeteer';
import { isString } from 'util';
import Job from '../Job';
import Site from '../Site';

export default class StackOverflow implements Site {
  name = 'StackOverflow';
  logoImage =
    'https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-logo.png';
  address = 'https://stackoverflow.com';
  endpointAddress = 'https://stackoverflow.com/jobs?l=Poland';
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
      const salarySelector = this.selectors.listSalarySelector.replace(
        'INDEX',
        i.toString()
      );
      const addedDateSelector = this.selectors.listAddedDateSelector.replace(
        'INDEX',
        i.toString()
      );
      const companySelector = this.selectors.listCompanySelector.replace(
        'INDEX',
        i.toString()
      );
      const technologiesSelector = this.selectors.listTechnologiesSelector.replace(
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
          return element ? element.innerText.replace('-', '').trim() : null;
        }, citySelector);

        let salary = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText.trim() : null;
        }, salarySelector);

        let addedDate = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        let company = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, companySelector);

        let technologies = await this.page.evaluate((sel: string) => {
          const elements = document.querySelectorAll(sel) as any;
          return elements ? [...elements].map(el => el.innerText) : null;
        }, technologiesSelector);

        jobOffers.push({
          addedDate: this.getOfferDate(addedDate),
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          salary: this.getSalary(salary),
          company: company,
          technologies: technologies,
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  async goToNextPage() {
    const nextPageLink = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? element.href : null;
    }, this.selectors.lastPageButtonSelector);

    await Promise.all([
      this.page.goto(nextPageLink, { waitUntil: 'networkidle0' }),
      this.page.waitForNavigation()
    ]);
  }

  private async isLastPage() {
    return await this.page.evaluate((sel: string) => {
      let element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? false : true;
    }, this.selectors.lastPageButtonSelector);
  }

  private getSalary(salaryText: string) {
    if (salaryText) {
      const splittedString = salaryText.trim().split('-');
      const currency = splittedString[0].replace(/[0-9,k]/g, '');

      let from = splittedString[0];
      let to = splittedString[1];

      from = from.slice(1);
      from = from ? from.replace('k', '000') : '0';

      to = to ? to.replace('k', '000') : '0';

      return {
        currency: currency,
        from: this.getMontSalary(from),
        to: this.getMontSalary(to)
      };
    } else {
      return null;
    }
  }

  private getMontSalary(salary: string) {
    if (isNaN(parseInt(salary))) {
      return null;
    } else {
      return Math.round(parseInt(salary) / 12);
    }
  }

  private getOfferDate(created: string) {
    if (created && isString(created)) {
      let todayDate = new Date();

      if (created === 'today') {
        return todayDate;
      } else if (created === 'yesterday') {
        todayDate.setDate(todayDate.getDate() - 1);
        return todayDate;
      } else {
        const howMany = Number(created.split(' ')[0][0]);
        const unit: 'h' | 'd' | 'w' | string = created.split(' ')[0][1];

        switch (unit) {
          case 'h':
          case 'hours': {
            todayDate.setHours(todayDate.getHours() - howMany);
            return todayDate;
            break;
          }
          case 'd':
          case 'days': {
            todayDate.setDate(todayDate.getDate() - howMany);
            return todayDate;
            break;
          }
          case 'w':
          case 'weeks': {
            todayDate.setDate(todayDate.getDate() - howMany * 7);
            return todayDate;
            break;
          }
          default: {
            return null;
            break;
          }
        }
      }
    } else {
      return null;
    }
  }

  readonly selectors = {
    lastPageButtonSelector:
      '#mainbar > div.jobsfooter.js-footer.mb32.pt32 > div > div:nth-child(1) > div > a.prev-next.job-link.test-pagination-next',
    lengthSelectorClass:
      '#mainbar > div.js-search-results.flush-left > div > div',
    listPositionSelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-title > h2 > a',
    listCitySelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-company > span:nth-child(2)',
    listSalarySelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.mt2.-perks > span',
    listAddedDateSelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-title > span:nth-child(3)',
    listCompanySelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-company > span:nth-child(1)',
    listTechnologiesSelector:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-tags > a'
  };
}
