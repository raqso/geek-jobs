import { Browser } from 'puppeteer';
import Job from '../Job';
import Site from '../Site';
import { isString } from 'util';

export default class InfoPraca implements Site {
  name = 'InfoPraca';
  address = 'https://www.infopraca.pl';
  endpointAddress =
    'https://www.infopraca.pl/praca?ct=it-programowanie-analizy';
  logoImage =
    'https://static.infopraca.pl/static/vee086020901d/pl/pl/new/img/logos/header.png';
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
    /* await this.setFetchingHtmlOnly(); */
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

  async goToNextPage() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(this.selectors.lastPageButtonSelector)
    ]);
  }

  private async isLastPage() {
    const lastButtonValue = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.innerText : '';
    }, this.selectors.lastPageButtonSelector);

    return lastButtonValue !== 'Dalej';
  }

  private async getJobsForThePage() {
    const listLength = await this.page.evaluate((sel: string) => {
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
      const addedDateSelector = this.selectors.listAddedDateSelector.replace(
        'INDEX',
        i.toString()
      );

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(sel) as HTMLAnchorElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        const company = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText.trim() : null;
        }, companySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, citySelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getOfferDate(addedDate),
          company: company,
          companyLogo: companyLogo,
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getOfferDate(created: string) {
    if (created && isString(created)) {
      const splitted = created.split(':');
      created = splitted[splitted.length - 1].trim();

      const howMany = Number(created.split(' ')[0]);
      const unit: 'godziny' | 'dni' | 'tygodnie' | string = created.split(
        ' '
      )[1];
      let todayDate = new Date();

      if (created.toUpperCase() === 'DZISIAJ') {
        return todayDate;
      } else if (created.toUpperCase() === 'WCZORAJ') {
        todayDate.setDate(todayDate.getDate() - 1);
        return todayDate;
      } else {
      switch (unit) {
        case 'godziny':
        case 'godzinę': {
          todayDate.setHours(todayDate.getHours() - howMany);
          return todayDate;
          break;
        }
        case 'dni':
        case 'dzień': {
          todayDate.setDate(todayDate.getDate() - howMany);
          return todayDate;
          break;
        }
        case 'tydzień':
        case 'tygodnie': {
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
      '#page-content > div > div > div > ul.pagination > li:last-child > a',
    lengthSelectorClass: '#results-list > li.container',
    listPositionSelector:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h2.p-job-title > a',
    listCompanySelector:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h3 > a',
    listCompanyLogoSelector:
      '#results-list > li:nth-child(INDEX) > div.job-offer-content > div > div.serp-company-logo > a > img',
    listCitySelector:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h4.serp-one-location > span.p-locality',
    listAddedDateSelector:
      '#results-list > li:nth-child(INDEX) > div > div.position-footer > span.last-update',
    listTechnologiesSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > ul'
  };
}
