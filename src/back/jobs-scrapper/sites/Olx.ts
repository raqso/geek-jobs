import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class Olx extends RenderedSite {
  readonly name = 'Olx';
  readonly logoImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/OLX_Logo.jpg/720px-OLX_Logo.jpg';
  readonly address = 'https://olx.pl';
  readonly endpointAddress = 'https://www.olx.pl/praca/informatyka/';

  protected goToNextPage = async () => await this.goToNextPageViaLastPageLink(this.selectors.lastPageButton);

  protected async isLastPage() {
    return await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? false : true;
    }, this.selectors.lastPageButton);
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [positionSelector, citySelector, salaryFromSelector, salaryToSelector, addedDateSelector] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCity,
        this.selectors.listSalaryFrom,
        this.selectors.listSalaryTo,
        this.selectors.listAddedDate
      ], i);

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(sel) as HTMLAnchorElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, positionSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, citySelector);

        const salaryFrom = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, salaryFromSelector);

        const salaryTo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, salaryToSelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
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
    if (created && typeof created === 'string') {
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

        if (month > todayDate.getMonth()) {
          todayDate.setFullYear( todayDate.getFullYear() - 1);
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
    lastPageButton:
      '#body-container > div > div > div.pager.rel.clr > span.fbold.next.abs.large > a',
    lengthClass: 'tr.wrap',
    listPosition:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr > td.title-cell > div > h3 > a',
    listCity:
      'tr.wrap:nth-child(INDEX) >td > div > table > tbody > tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(1) > span',
    listSalaryFrom:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > div > span:nth-child(1)',
    listSalaryTo:
      'tr.wrap:nth-child(INDEX) > td > div > table > tbody > tr:nth-child(1) > td.title-cell > div > div > span:nth-child(2)',
    listAddedDate:
      'tr.wrap:nth-child(INDEX) >td > div > table > tbody > tr:nth-child(2) > td.bottom-cell > div > p > small:nth-child(2) > span'
  };
}
