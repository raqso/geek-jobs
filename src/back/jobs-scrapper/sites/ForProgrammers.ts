import { Browser } from 'puppeteer';
import { isString } from 'util';
import Job from '../Job';
import Site from '../Site';

export default class ForProgrammers implements Site {
  readonly name = '4Programmers.net';
  readonly logoImage = 'https://static.4programmers.net/img/logo.png';
  readonly address = 'https://4programmers.net';
  readonly endpointAddress = 'https://4programmers.net/Praca';
  browser: Browser;
  page: any;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  public async getJobs() {
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

    return lastButtonValue !== '»';
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
          return element ? element.innerText : null;
        }, companySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.innerText : null;
        }, citySelector);

        const salary = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLElement;
          return element ? element.innerText : null;
        }, salarySelector);

        const technologies = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLUListElement;
          return element ? element.innerText : null;
        }, technologiesSelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLTableDataCellElement;
          return element ? element.innerText.trim() : null;
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
    if (created === 'Nowe') {
      return new Date();
    }
    else if (created && isString(created)) {
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
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > p:nth-child(3) > small > a',
    listSalarySelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-salary.hidden-xs.hidden-xxs > p > strong',
    listAddedDateSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-time',
    listTechnologiesSelector:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > ul'
  };
}
