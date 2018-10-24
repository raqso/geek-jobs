import { Browser } from 'puppeteer';

export default class Pracuj implements Site {
  readonly categoryIdItAdministration = '5015';
  readonly categoryIdSoftwareDevelopment = '5016';

  name = 'Pracuj.pl';
  address = 'https://pracuj.pl';
  endpointAddress =
    'https://www.pracuj.pl/praca?cc=' +
    this.categoryIdSoftwareDevelopment +
    '%2c' +
    this.categoryIdSoftwareDevelopment;
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
      const [] = await Promise.all([
        this.page.waitForNavigation(),
        this.clickNextPage()
      ]);

      isLast = await this.isLastPage();
    }

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

  private async isLastPage() {
    const lastPageButtonSelector =
      '#returnUrl > ul.desktopPagin.clearfix > li:last-child';
    let lastButtonText = await this.page.evaluate((sel: string) => {
      let element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? element.innerText : '';
    }, lastPageButtonSelector);

    return Number.isInteger(parseInt(lastButtonText));
  }

  private async clickNextPage() {
    const lastPageButtonSelector =
      '#returnUrl > ul.desktopPagin.clearfix > li:last-child > a';
    if (lastPageButtonSelector) {
      console.log('Going next page...');
      await this.page.click(lastPageButtonSelector);
    }
  }

  private async getJobsForThePage() {
    let jobOffers: Job[] = [];
    const listPositionSelector =
      '#mainOfferList > li:nth-child(INDEX) > h2 > a';
    const listCompanySelector = '#mainOfferList > li:nth-child(INDEX) > h3 > a';
    const listCompanyLogoSelector =
      '#mainOfferList > li:nth-child(INDEX) > a > img';
    const listCitySelector =
      '#mainOfferList > li:nth-child(INDEX) > p > span > span > span.o-list_item_desc_location_name.latlng';
    const listAddedDateSelector =
      '#mainOfferList > li:nth-child(INDEX) > p > span.o-list_item_desc_date';

    const lengthSelectorClass = 'o-list_item';

    let listLength = await this.page.evaluate((sel: string) => {
      return document.getElementsByClassName(sel).length;
    }, lengthSelectorClass);

    for (let i = 1; i <= listLength; i++) {
      // change the index to the next child
      const positionSelector = listPositionSelector.replace(
        'INDEX',
        i.toString()
      );
      const companySelector = listCompanySelector.replace(
        'INDEX',
        i.toString()
      );
      const companyLogoSelector = listCompanyLogoSelector.replace(
        'INDEX',
        i.toString()
      );
      const citySelector = listCitySelector.replace('INDEX', i.toString());
      const addedDateSelector = listAddedDateSelector.replace(
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
          let element = document.querySelector(sel) as HTMLAnchorElement;
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

        let addedDate = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        jobOffers.push({
          addedDate: this.getDateObject(addedDate),
          company: company,
          companyLogo: companyLogo,
          dateCrawled: new Date(),
          link: offerLink,
          location: this.getCity(location),
          position: position,
          salaryRange: {},
          website: this.name
        });
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

  private getCity(location: string) {
    if (location) {
      return location.split(',')[0];
    } else {
      return '';
    }
  }
}
