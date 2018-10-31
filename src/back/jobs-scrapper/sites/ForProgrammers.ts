import { Browser } from 'puppeteer';
import { isString } from 'util';
import Job from '../Job';

export default class ForProgrammers implements Site {
  name = '4Programmers.net';
  logoImage = 'https://static.4programmers.net/img/logo.png';
  address = 'https://4programmers.net';
  endpointAddress = 'https://4programmers.net/Praca';
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

  async goToNextPage() {
    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(this.selectors.lastPageButtonSelector)
    ]);
  }

  private async isLastPage() {
    let lastButtonValue = await this.page.evaluate((sel: string) => {
      let element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.innerText : '';
    }, this.selectors.lastPageButtonSelector);

    return lastButtonValue !== '»';
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
      const salarySelector = this.selectors.listSalarySelector.replace(
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
          let element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText : null;
        }, companySelector);

        let companyLogo = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        let location = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText : null;
        }, citySelector);

        let salary = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLElement;
          return element ? element.innerText : null;
        }, salarySelector);

        let technologies = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLUListElement;
          return element ? element.innerText : null;
        }, technologiesSelector);

        let addedDate = await this.page.evaluate((sel: string) => {
          let element = document.querySelector(sel) as HTMLElement;
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
          technologies: this.getTechnologiesArray(technologies),
          salary: this.getSalary(salary),
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }
    return jobOffers;
  }

  private getSalary(salaryText: string): Job['salary'] {
    if (salaryText && salaryText.split(' - ').length === 2) {
      const splittedText = salaryText.split(' - ');
      return {
        from: Number(this.clearSalaryString(splittedText[0])),
        to: Number(this.clearSalaryString(splittedText[1].split(' ')[0])),
        currency: this.clearSalaryString(splittedText[1].split(' ')[1])
      };
    } else {
      return undefined;
    }
  }

  private clearSalaryString(salaryText: string) {
    if (salaryText) {
      return salaryText.replace(/( |\r\n\t|\n|\r\t )/gm, '');
    } else {
      return '';
    }
  }

  private getTechnologiesArray(technologies: string) {
    if (technologies) {
      return technologies.split(' ');
    } else {
      return [];
    }
  }

  private getOfferDate(created: string) {
    if (created && isString(created)) {
      const howMany = Number(created.split(' ')[0]);
      const unit: 'godziny' | 'dni' | 'tygodnie' | string = created.split(
        ' '
      )[1];
      let todayDate = new Date();

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
    } else {
      return null;
    }
  }

  readonly selectors = {
    lastPageButtonSelector:
      '#job-main-content > main > nav.pull-left > ul > li:last-child',
    lengthSelectorClass: '#box-jobs > table > tbody > tr',
    listPositionSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > h2 > a',
    listCompanySelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > p:nth-child(3) > a',
    listCompanyLogoSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-logo > a > img',
    listCitySelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > p:nth-child(3) > a',
    listSalarySelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-salary.hidden-xs.hidden-xxs > p > strong',
    listAddedDateSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-time.hidden-sm.hidden-xs.hidden-xxs > small',
    listTechnologiesSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > ul'
  };
}
