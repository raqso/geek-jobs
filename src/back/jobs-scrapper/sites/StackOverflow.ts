import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class StackOverflow extends RenderedSite {
  readonly name = 'StackOverflow';
  readonly logoImage =
    'https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-logo.png';
  readonly address = 'https://stackoverflow.com';
  readonly endpointAddress = 'https://stackoverflow.com/jobs?l=Poland';

  protected goToNextPage = async () => this.goToNextPageViaLink(this.selectors.lastPageButton);

  protected async isLastPage() {
    return await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? false : true;
    }, this.selectors.lastPageButton);
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((selector: string) => {
      return document.querySelectorAll(selector).length;
    }, this.selectors.lengthClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [positionSelector, citySelector, salarySelector, addedDateSelector, companySelector, technologiesSelector] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCity,
        this.selectors.listSalary,
        this.selectors.listAddedDate,
        this.selectors.listCompany,
        this.selectors.listTechnologies
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
          return element ? element.innerText.replace('-', '').trim() : null;
        }, citySelector);

        const salary = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText.trim() : null;
        }, salarySelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        const company = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, companySelector);

        const technologies = await this.page.evaluate((sel: string) => {
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
    if (created && (typeof created === 'string') ) {
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
    lastPageButton:
      '#mainbar > div.jobsfooter.js-footer.mb32.pt32 > div > div:nth-child(1) > div > a.prev-next.job-link.test-pagination-next',
    lengthClass:
      '#mainbar > div.js-search-results.flush-left > div > div',
    listPosition:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-title > h2 > a',
    listCity:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-company > span:nth-child(2)',
    listSalary:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.mt2.-perks > span',
    listAddedDate:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-title > span:nth-child(3)',
    listCompany:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-company > span:nth-child(1)',
    listTechnologies:
      '#mainbar > div.js-search-results.flush-left > div > div.-item:nth-child(INDEX) > div.-job-summary > div.-tags > a'
  };
}
