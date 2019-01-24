import Job from '../Job';
import RenderedSite from '../RenderedSite';

export default class InfoPraca extends RenderedSite {
  readonly name = 'InfoPraca';
  readonly address = 'https://www.infopraca.pl';
  readonly endpointAddress =
    'https://www.infopraca.pl/praca?ct=it-programowanie-analizy';
  readonly logoImage =
    'https://static.infopraca.pl/static/vee086020901d/pl/pl/new/img/logos/header.png';

  protected goToNextPage = async () => await this.goToNextPageViaLink(this.selectors.lastPageButton);

  protected async isLastPage() {
    const lastButtonValue = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLUListElement;
      return element ? element.innerText : '';
    }, this.selectors.lastPageButton);

    return lastButtonValue !== 'Dalej';
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((sel: string) => {
      return document.querySelectorAll(sel).length;
    }, this.selectors.lengthClass);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [positionSelector, companySelector, companyLogoSelector, citySelector, addedDateSelector] = this.replaceTextToIndex([
        this.selectors.listPosition,
        this.selectors.listCompany,
        this.selectors.listCompanyLogo,
        this.selectors.listCity,
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
    if (created && typeof created === 'string') {
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
    lastPageButton:
      '#page-content > div > div > div > ul.pagination > li:last-child > a',
    lengthClass: '#results-list > li.container',
    listPosition:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h2.p-job-title > a',
    listCompany:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h3 > a',
    listCompanyLogo:
      '#results-list > li:nth-child(INDEX) > div.job-offer-content > div > div.serp-company-logo > a > img',
    listCity:
      '#results-list > li:nth-child(INDEX) > div > div.container > div.container.joboffer-main-details > h4.serp-one-location > span.p-locality',
    listAddedDate:
      '#results-list > li:nth-child(INDEX) > div > div.position-footer > span.last-update',
    listTechnologies:
      '#box-jobs > table > tbody > tr:nth-child(INDEX) > td.col-body > ul'
  };
}