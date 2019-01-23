import { Browser } from 'puppeteer';
import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class BulldogJob extends RenderedSite {
  readonly name = 'BulldogJob';
  readonly logoImage = 'https://cdn.bulldogjob.com/assets/logo-6d85aa7138552c5b466f9a4fb26785893cceb34e7b344915bba0392dd125287a.png';
  readonly address = 'https://bulldogjob.pl/';
  readonly endpointAddress =
    'https://bulldogjob.pl/companies/jobs?mode=plain&page=';
  page: any;

  pageNumber = 1;

  async goToNextPage(pageNumber: number) {
    await this.page.waitFor(2 * 1000);
    await this.page.goto(this.endpointAddress + pageNumber);
    pageNumber++;
  }

  protected async isLastPage() {
    const offersListSelector = '#search-result > div > section > ul';

    const offersOnPage = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.childElementCount : 0;
    }, offersListSelector);

    return offersOnPage === 0;
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      // const [positionSelector, companySelector, companyLogoSelector, citySelector, technologiesSelector, addedDateSelector] =
      const positionSelector = this.selectors.listPosition.replace(
        'INDEX',
        i.toString()
      );
      const companySelector = this.selectors.listCompany.replace(
        'INDEX',
        i.toString()
      );
      const companyLogoSelector = this.selectors.listCompanyLogSelector.replace(
        'INDEX',
        i.toString()
      );
      const citySelector = this.selectors.listCity.replace(
        'INDEX',
        i.toString()
      );
      const technologiesSelector = this.selectors.listTechnologies.replace(
        'INDEX',
        i.toString()
      );
      const addedDateSelector = this.selectors.listAddedDate.replace(
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
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, companySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.src : null;
        }, companyLogoSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, citySelector);

        const technologies = await this.page.evaluate((sel: string) => {
            const element = document.querySelector(sel) as HTMLUListElement;
            return element ? element.innerText : null;
          }, technologiesSelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
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
    listPosition:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > h2 > a',
    listCompany:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > p > span.pop.desktop',
    listCompanyLogSelector:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.image > a > img',
    listCity:
      '#search-result > div > section > ul > li:nth-child(13) > div.description > div > p > span.pop-mobile',
    listAddedDate:
      '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > p > span.inline-block',
    listTechnologies: '#search-result > div > section > ul > li:nth-child(INDEX) > div.description > div > ul',
      lengthClass: '#search-result > div > section > ul > li'
  };
}
